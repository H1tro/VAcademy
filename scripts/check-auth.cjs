const assert=require('node:assert/strict'),fs=require('node:fs'),Module=require('node:module'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
let session=null,listener,confirm=true,lastSignUp,changedPassword,lastSignOut;
const user={id:'account-1',email:'test@example.org',user_metadata:{displayName:'Test',photoURL:''}};
const fake={auth:{
 getSession:async()=>({data:{session},error:null}),
 onAuthStateChange:fn=>{listener=fn;fn('INITIAL_SESSION',session);return {data:{subscription:{unsubscribe:()=>{listener=null;}}}};},
 signInWithPassword:async input=>input.password==='wrong'?{error:new Error('Invalid login credentials')}:{data:{user},error:null},
 signUp:async input=>{lastSignUp=input;return {data:{user,session:confirm?null:{user,access_token:'token'}},error:null};},
 updateUser:async input=>{if(input.password)changedPassword=input.password;else user.user_metadata={...user.user_metadata,...input.data};return {data:{user},error:null};},
 signOut:async input=>{lastSignOut=input;session=null;listener?.('SIGNED_OUT',null);return {error:null};}
}};
const original=Module._load;Module._load=function(name,...args){if(name==='@/utils/supabase/client')return {createClient:()=>fake};if(name==='@/utils/supabase/config')return {isSupabaseConfigured:()=>true};return original.call(this,name,...args);};
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
 console.log('Supabase auth: confirmation flow, metadata, session changes, token ownership, profile/password updates and sign-out passed.');
})().catch(e=>{console.error(e);process.exitCode=1;});
