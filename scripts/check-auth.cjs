const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
let session=null,listener,confirm=true,lastSignUp,changedPassword,lastSignOut,lastReset,lastResend,lastOtp,exchanges=0,sendError=null;
const user={id:'account-1',email:'test@example.org',user_metadata:{displayName:'Test',photoURL:''}};
const fake={auth:{
 resetPasswordForEmail:async(email,options)=>{lastReset={email,options};return {error:sendError};},
 resend:async(input)=>{lastResend=input;return {error:sendError};},
 exchangeCodeForSession:async code=>{exchanges++;return {error:code==='expired'?new Error('expired'):null};},
 verifyOtp:async input=>{lastOtp=input;return {error:input.token_hash==='expired'?new Error('expired'):null};},
 getSession:async()=>({data:{session},error:null}),
 onAuthStateChange:fn=>{listener=fn;fn('INITIAL_SESSION',session);return {data:{subscription:{unsubscribe:()=>{listener=null;}}}};},
 signInWithPassword:async input=>input.password==='wrong'?{error:new Error('Invalid login credentials')}:{data:{user},error:null},
 signUp:async input=>{lastSignUp=input;return {data:{user,session:confirm?null:{user,access_token:'token'}},error:null};},
 updateUser:async input=>{if(input.password)changedPassword=input.password;else user.user_metadata={...user.user_metadata,...input.data};return {data:{user},error:null};},
 signOut:async input=>{lastSignOut=input;session=null;listener?.('SIGNED_OUT',null);return {error:null};}
}};
const original=Module._load;Module._load=function(name,...args){if(name==='@/utils/supabase/client'||name==='@/utils/supabase/server')return {createClient:()=>fake};if(name==='next/headers')return {cookies:async()=>({})};if(name==='@/utils/supabase/config')return {isSupabaseConfigured:()=>true};return original.call(this,name,...args);};
global.window={location:{origin:'https://example.org'}};
const auth=require('../src/lib/auth-client.ts');
(async()=>{
 let observed='pending';const unsubscribe=auth.onAuthStateChanged(auth.auth,u=>{observed=u;});await Promise.resolve();assert.equal(observed,null);
 const metadata={displayName:'Test',legalAcknowledgement:{ageRange:'13-17',guardianPermission:true}};
 const pending=await auth.createUserWithEmailAndPassword(auth.auth,'test@example.org','password',metadata);assert.equal(pending.session,null);assert.equal(auth.auth.currentUser,null);assert.deepEqual(lastSignUp.options.data,metadata);assert.equal(lastSignUp.options.emailRedirectTo,'https://example.org/auth/callback');
 confirm=false;await auth.createUserWithEmailAndPassword(auth.auth,'test@example.org','password',metadata);assert.equal(auth.auth.currentUser.uid,user.id);
 session={user,access_token:'verified-by-server'};listener('SIGNED_IN',session);await Promise.resolve();assert.equal(observed.uid,user.id);assert.equal(await observed.getIdToken(),'verified-by-server');
 session={user:{...user,id:'different-account'},access_token:'wrong'};await assert.rejects(observed.getIdToken(),/Sign in again/);session={user,access_token:'verified-by-server'};
 await assert.rejects(auth.reauthenticateWithCredential(observed,auth.EmailAuthProvider.credential(user.email,'wrong')),/Invalid login credentials/);
 await auth.updateProfile(observed,{displayName:'Updated'});assert.equal(auth.auth.currentUser.displayName,'Updated');await auth.updatePassword(observed,'new-password');assert.equal(changedPassword,'new-password');
 await auth.signOut(auth.auth);await Promise.resolve();assert.deepEqual(lastSignOut,{scope:'local'});assert.equal(auth.auth.currentUser,null);assert.equal(observed,null);unsubscribe();
 await auth.sendPasswordResetEmail(' test@example.org ');assert.deepEqual(lastReset,{email:'test@example.org',options:{redirectTo:'https://example.org/auth/callback?next=/reset-password'}});
 await auth.resendConfirmationEmail(' test@example.org ');assert.deepEqual(lastResend,{type:'signup',email:'test@example.org',options:{emailRedirectTo:'https://example.org/auth/callback'}});
 sendError={status:429,code:'over_email_send_rate_limit'};await assert.rejects(auth.resendConfirmationEmail(user.email),error=>error.code==='over_email_send_rate_limit');sendError=null;
 const callback=require('../src/app/auth/callback/route.ts').GET,confirmation=require('../src/app/auth/confirm/route.ts').GET;
 assert.equal((await callback(new Request('https://example.org/auth/callback?code=valid&next=/reset-password'))).headers.get('cache-control'),'private, no-store');
 const location=async(handler,path)=>(await handler(new Request('https://example.org'+path))).headers.get('location');
 assert.equal(await location(callback,'/auth/callback?code=valid&next=/reset-password'),'https://example.org/reset-password');
 assert.equal(await location(callback,'/auth/callback?code=valid&next=https://attacker.example'),'https://example.org/dashboard','External redirect must be ignored');
 assert.equal(await location(callback,'/auth/callback?code=expired&next=/reset-password'),'https://example.org/forgot-password?recovery=failed');
 const before=exchanges;assert.equal(await location(callback,'/auth/callback?next=/reset-password'),'https://example.org/forgot-password?recovery=failed');assert.equal(exchanges,before);
 assert.equal(await location(confirmation,'/auth/confirm?token_hash=valid&type=recovery'),'https://example.org/reset-password');assert.equal(lastOtp.type,'recovery');
 assert.equal(await location(confirmation,'/auth/confirm?token_hash=valid&type=email'),'https://example.org/dashboard');assert.equal(lastOtp.type,'email');
 assert.equal(await location(confirmation,'/auth/confirm?token_hash=expired&type=recovery'),'https://example.org/forgot-password?recovery=failed');
 lastOtp=null;assert.equal(await location(confirmation,'/auth/confirm?token_hash=valid&type=invite'),'https://example.org/resend-confirmation?confirmation=failed');assert.equal(lastOtp,null,'Unsupported OTP type must never be verified');
 console.log('Supabase auth: confirmation flow, metadata, session changes, token ownership, profile/password updates, email requests, recovery redirects, expired links and sign-out passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
