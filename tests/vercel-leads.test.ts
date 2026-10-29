import test from 'node:test';
import assert from 'node:assert/strict';
import { submitLead } from '../src/features/leads/server/handler';
test('Vercel submits normalized enquiries through the server-only database adapter',async()=>{
 const previous={fetch:globalThis.fetch,url:process.env.SUPABASE_URL,key:process.env.SUPABASE_SERVICE_ROLE_KEY};
 process.env.SUPABASE_URL='https://example.supabase.co';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';
 let calls=0;
 const data={requestId:crypto.randomUUID(),services:['Meta Ads'],goal:'More qualified leads',budget:'Under $500',timeline:'Within a month',business:'Test business',website:'',country:'Pakistan',context:'A sufficiently detailed test enquiry.',name:'Test Client',email:'qa@example.com',whatsapp:'+92 300 1234567',consent:true,companyFax:''};
 const request=(body:unknown)=>new Request('https://www.zainababdullah.tech/api/leads',{method:'POST',headers:{origin:'https://www.zainababdullah.tech','content-type':'application/json'},body:JSON.stringify(body)});
 try{
 globalThis.fetch=async(url,options)=>{calls++;assert.equal(String(url),'https://example.supabase.co/rest/v1/rpc/submit_website_lead');const body=JSON.parse(options!.body as string);assert.equal(body.brief.whatsapp,'+923001234567');assert.equal(options!.cache,'no-store');return Response.json({id:data.requestId});};
 assert.equal((await submitLead(request({...data,whatsapp:''}))).status,400);assert.equal(calls,0);
 assert.equal((await submitLead(request(data))).status,201);assert.equal(calls,1);
 globalThis.fetch=async()=>new Response('unavailable',{status:500});
 assert.equal((await submitLead(request(data))).status,503);
 }finally{globalThis.fetch=previous.fetch;if(previous.url===undefined)delete process.env.SUPABASE_URL;else process.env.SUPABASE_URL=previous.url;if(previous.key===undefined)delete process.env.SUPABASE_SERVICE_ROLE_KEY;else process.env.SUPABASE_SERVICE_ROLE_KEY=previous.key;}
});
