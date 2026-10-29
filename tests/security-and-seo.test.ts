import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {verifyEditorToken,isBlogEditor} from '../src/features/blog/server/auth';
import {serializeJsonLd} from '../src/components/seo/json-ld';
import imageLoader from '../src/lib/media/image-loader';
import markets from '../src/content/markets.json';
import manifest from '../src/lib/media/image-manifest.json';
test('editor identity must be verified by Supabase and explicitly allowlisted',async()=>{
 const old={fetch:globalThis.fetch,url:process.env.SUPABASE_URL,key:process.env.SUPABASE_SERVICE_ROLE_KEY,editors:process.env.BLOG_EDITOR_EMAILS};
 try{
  process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';process.env.BLOG_EDITOR_EMAILS='owner@example.com';
  assert.equal(await verifyEditorToken(),null);
  globalThis.fetch=async()=>new Response(null,{status:401});assert.equal(await verifyEditorToken('forged'),null);
  globalThis.fetch=async(url,options)=>{assert.equal(String(url),'https://example.supabase.co/auth/v1/user');assert.equal((options?.headers as Record<string,string>).Authorization,'Bearer valid');return Response.json({id:'test-user',email:'owner@example.com'});};
  assert.equal(isBlogEditor(await verifyEditorToken('valid')),true);
  assert.equal(isBlogEditor({userId:'unapproved',email:'visitor@example.com'}),false);
 }finally{globalThis.fetch=old.fetch;for(const [key,value] of Object.entries({SUPABASE_URL:old.url,SUPABASE_SERVICE_ROLE_KEY:old.key,BLOG_EDITOR_EMAILS:old.editors})){if(value===undefined)delete process.env[key];else process.env[key]=value;}}
});
test('structured data escapes executable markup and mobile portraits select smaller assets',()=>{
 const serialized=serializeJsonLd({text:'</script><script>alert(1)</script>'});assert.equal(serialized.includes('</script>'),false);
 for(const [src,asset] of Object.entries(manifest)){
  const output=imageLoader({src,width:480});assert.equal(output,asset.variants.find(v=>v.width>=480)?.src);
  assert.ok(readFileSync(`public${output}`).byteLength>0);
 }
 assert.deepEqual(markets.map(m=>m.code),['US','SA','KW','QA']);
 assert.equal(new Set(markets.flatMap(m=>m.sections.map(s=>s[1]))).size,markets.reduce((sum,m)=>sum+m.sections.length,0));
});
