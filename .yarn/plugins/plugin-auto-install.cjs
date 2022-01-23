module.exports={name:"plugin-auto-install",factory:r=>{let y=r("child_process"),j=r("crypto"),a=r("fs"),o=r("path"),l=`plugin-auto-install v${void 0}`,h=!1,p="",S={validateProject(n){h=!0;let t=d(n);u(t,n)},afterAllInstalled(n){h=!1;let t=d(n);u(t,n)},async wrapScriptExecution(n,t,s,k,c){if(h)return n;try{let e=d(t);try{if(e&&e===m(t))return n}catch{}if(!u(e,t))return n;console.info(`${l} is running 'yarn install' due to dependency changes.`),y.spawnSync("yarn",["install"],{cwd:c.cwd,env:c.env}),console.info(`${l} finished 'yarn install'.`);let i=y.spawnSync("yarn",[k,...c.args],{cwd:c.cwd,env:c.env,stdio:"inherit",shell:!0});return async()=>i.status||0}catch{}return n}};function d(n){try{let t=j.createHash("sha256"),s=o.join(n.cwd,"yarn.lock");a.statSync(s,{throwIfNoEntry:!1})&&t.update(a.readFileSync(s,"utf-8"));for(let c of n.workspaces.map(e=>e.cwd).sort()){let e=o.join(c,"package.json"),i=JSON.parse(a.readFileSync(e,"utf-8")),w=Object.keys(i).filter(f=>f.endsWith("ependencies")),P=[];for(let f of w)P.push(...Object.entries(i[f]).map(([v,H])=>`${v}: ${H}`));t.update(P.sort().join(","))}return t.digest("hex")}catch{}}function m(n){let t=g(n);return a.readFileSync(o.join(t,"hash"),"utf-8")}function u(n,t){if(!n||n===p)return!1;try{let s=g(t);a.mkdirSync(s,{recursive:!0}),a.writeFileSync(o.join(s,"hash"),n),a.writeFileSync(o.join(s,".gitignore"),`.gitignore
hash`),console.info(`${l} updated dependency hash: ${n}`),p=n}catch{}return!0}function g(n){return o.join(n.cwd,".yarn","plugins","plugin-auto-install")}return{hooks:S}}};
//# sourceMappingURL=index.cjs.map
