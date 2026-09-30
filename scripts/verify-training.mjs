import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
await mkdir(".cache", { recursive: true });
await build({
  stdin: {
    contents: `
import assert from 'node:assert/strict';
import {generateQuestion,makeBlock,categories} from './lib/questions';
import {sessionReducer,accuracy,average} from './lib/training-context';
import {guides} from './lib/guide';
import {makeFlashCard} from './lib/flashcards';
const calculate = s => {const percent=s.match(/(\\d+)% of (\\d+)/);if(percent)return +percent[1]*+percent[2]/100;const expr=s.match(/(\\d+) ([+−]) (\\d+)/);assert(expr,s);return expr[2]==='+'?+expr[1]+ +expr[3]:+expr[1]- +expr[3]};
for(const category of categories)for(let i=0;i<1000;i++){
 const q=generateQuestion(category);assert.equal(q.category,category);assert(q.correct>=0&&q.correct<q.choices.length);assert.equal(new Set(q.choices).size,q.choices.length);
 if(category==='errors'){assert.equal([...q.stimulus[0]].filter((c,n)=>c!==q.stimulus[1][n]).length,q.correct);assert.equal(q.stimulus[0].length,q.stimulus[1].length)}
 if(category==='numbers'){const a=calculate(q.stimulus[0]);if(q.prompt.includes('Expression B')){const b=calculate(q.prompt);assert.equal(q.choices[q.correct],b>a?'Larger':b<a?'Smaller':'Equal')}else assert.equal(+q.choices[q.correct],a)}
 if(category==='spatial'){const black=q.stimulus[0].includes('ABOVE'),left=q.stimulus[1].includes('ABOVE');const valid=q.arrows.filter(c=>c.blackTop===black&&c.leftTop===left);assert.equal(valid.length,1);assert.deepEqual(q.arrows[q.correct],valid[0])}
 if(category==='reasoning'){const links=q.stimulus.map(s=>{const m=s.match(/^(.+) is (\\w+) than (.+)\\.$/);assert(m);return ['faster','newer','heavier','taller'].includes(m[2])?[m[1],m[3]]:[m[3],m[1]]});let ordered=[q.choices.find(v=>!links.some(e=>e[1]===v))];while(ordered.length<q.choices.length){const next=links.find(e=>e[0]===ordered.at(-1));assert(next);ordered.push(next[1])}const answer=q.prompt.includes('middle')?ordered[1]:/slowest|oldest|lightest|shortest/.test(q.prompt)?ordered.at(-1):ordered[0];assert.equal(q.choices[q.correct],answer)}
}
const ranks=new Set();for(let i=0;i<2000;i++){const q=generateQuestion('numbers');if(q.prompt.includes('Expression B'))continue;const sorted=[...q.choices].map(Number).sort((x,y)=>x-y);ranks.add(sorted.indexOf(+q.choices[q.correct]))}assert.equal(ranks.size,4,'numeric answer must not sit in a fixed sorted position');
const block=makeBlock('mixed');assert.equal(block.length,20);categories.forEach(c=>assert.equal(block.filter(q=>q.category===c).length,5));
const settings={selection:'mixed',mode:'exam',memorise:0,answer:6,sound:false,feedback:true};
let s=sessionReducer(null,{type:'start',settings});assert.equal(s.stage,'stimulus');assert.equal(sessionReducer(s,{type:'answer',choice:0,latency:1}),s);
for(let i=0;i<20;i++){s=sessionReducer(s,{type:'ready'});const old=s;assert.equal(sessionReducer(s,{type:'ready'}),old);s=sessionReducer(s,{type:'answer',choice:i===3?null:s.questions[s.index].correct,latency:i===3?6000:1000});assert.equal(s.responses.length,i+1);assert.equal(sessionReducer(s,{type:'answer',choice:0,latency:1}),s)}
assert.equal(s.stage,'done');assert.equal(accuracy(s.responses),95);assert.equal(average(s.responses),1250);
s=sessionReducer(null,{type:'start',settings:{...settings,mode:'practice'}});s=sessionReducer(s,{type:'ready'});s=sessionReducer(s,{type:'answer',choice:null,latency:6000});assert.equal(s.stage,'feedback');s=sessionReducer(s,{type:'next'});assert.equal(s.stage,'stimulus');assert.equal(s.index,1);s=sessionReducer(s,{type:'finish'});assert.equal(s.stage,'done');
const MOST=['faster','newer','heavier','taller'];let guideChecks=0;
for(const g of guides){const all=[...g.examples,{...g.worked,question:g.worked.question,cards:g.worked.cards}];for(const ex of all){guideChecks++;
 assert(ex.options.includes(ex.answer),g.id+': answer not in options '+ex.answer);assert.equal(new Set(ex.options).size,ex.options.length);
 if(g.id==='errors'){const[a,b]=ex.stimulus;assert.equal(a.length,b.length);assert.equal(String([...a].filter((c,n)=>c!==b[n]).length),ex.answer,a+'/'+b)}
 if(g.id==='numbers'){const a=calculate(ex.stimulus[0]);if(ex.question.includes('Expression B')){const b=calculate(ex.question);assert.equal(ex.answer,b>a?'Larger':b<a?'Smaller':'Equal',ex.question)}else assert.equal(+ex.answer,a,ex.stimulus[0])}
 if(g.id==='spatial'){const black=ex.stimulus[0].includes('ABOVE'),left=ex.stimulus[1].includes('ABOVE');const idx=ex.cards.findIndex(c=>c.blackTop===black&&c.leftTop===left);assert.equal(ex.cards.filter(c=>c.blackTop===black&&c.leftTop===left).length,1);assert.equal('Card '+'ABCD'[idx],ex.answer,ex.stimulus.join(' '))}
 if(g.id==='reasoning'){const links=ex.stimulus.map(s=>{const m=s.match(/^The (.+) is (\\w+) than the (.+)\\.$/);assert(m,s);return MOST.includes(m[2])?[m[1],m[3]]:[m[3],m[1]]});const items=[...new Set(links.flat())];assert.deepEqual([...items].sort(),[...ex.options].sort());let ordered=[items.find(v=>!links.some(e=>e[1]===v))];while(ordered.length<items.length){const nx=links.find(e=>e[0]===ordered.at(-1));assert(nx,'broken chain '+ex.stimulus);ordered.push(nx[1])}
  const q=ex.question;const want=/middle|neither/.test(q)?(assert.equal(ordered.length,3),ordered[1]):/slowest|oldest|lightest|shortest/.test(q)?ordered.at(-1):ordered[0];
  // "oldest" is the 'least new' end because the chain is ordered by the MOST word (newer)
  assert.equal(ex.answer,want,q+' '+ex.stimulus.join(' '))}
}}
console.log('Verified '+guideChecks+' guide examples and answer keys.');
for(let i=0;i<5000;i++){const c=makeFlashCard(['mixed','add','sub'][i%3]);assert(c.a>=10&&c.a<=99&&c.b>=10&&c.b<=99,'two-digit');assert.equal(c.answer,c.op==='+'?c.a+c.b:c.a-c.b);assert(c.answer>0);
 for(const lines of [c.round,c.split]){assert(lines.at(-1).endsWith('= '+c.answer),lines.join(' | '));for(const l of lines){const m=l.match(/(\\d+) ([+−]) (\\d+) = (\\d+)/);assert(m,l);assert.equal(+m[4],m[2]==='+'?+m[1]+ +m[3]:+m[1]-+m[3],l)}}}
console.log('Verified 5,000 flashcards and every working step.');
console.log('Verified 4,000 procedural questions, unique spatial solutions, balanced blocks, timeouts, double-answer guards, feedback and score calculations.');
`,
    resolveDir: process.cwd(),
    sourcefile: "verify-engine.ts",
  },
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: ".cache/verify-engine.mjs",
  external: ["react"],
});
await import(new URL("../.cache/verify-engine.mjs", import.meta.url));
