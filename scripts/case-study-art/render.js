// Renders each <name>.html here to a 1200x1200 <name>.png. Usage: node render.js fabric-cli ai-design-repo ...
// Then convert to WebP into public/images/case-studies/.
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:1200}});
for(const n of process.argv.slice(2)){await p.goto('file://'+__dirname+'/'+n+'.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:__dirname+'/'+n+'.png'});}
await b.close();})();
