const R="gemini-2.5-flash";async function T(i,r,e=null){var s,p,c,y,d,u;if(!i)throw new Error("Gemini API Key is missing. Please click the key icon to set your API Key.");const o=`https://generativelanguage.googleapis.com/v1beta/models/${R}:generateContent?key=${i.trim()}`,n={contents:[{parts:[{text:r}]}],generationConfig:{temperature:.3,responseMimeType:"application/json"}};e&&(n.generationConfig.responseSchema=e);const t=await fetch(o,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});if(!t.ok){const m=((s=(await t.json().catch(()=>({}))).error)==null?void 0:s.message)||t.statusText;throw new Error(`Gemini API Error (${t.status}): ${m}`)}const a=(u=(d=(y=(c=(p=(await t.json()).candidates)==null?void 0:p[0])==null?void 0:c.content)==null?void 0:y.parts)==null?void 0:d[0])==null?void 0:u.text;if(!a)throw new Error("Received empty response from Gemini AI.");try{return JSON.parse(a)}catch{throw console.error("JSON Parsing Error from Gemini output:",a),new Error("Failed to parse structured JSON from Gemini response.")}}async function S(i,r,e){const o=e.length>5e4?e.slice(0,5e4)+`
...[Text truncated for size]`:e,n=`
You are Liliview AI, an expert, encouraging study tutor creating a complete study kit for a student studying "${r}".
Based on the following extracted document text, generate a comprehensive study kit containing:
1. A COMPLETE REVIEWER (Summary, Core Concepts, Key Definitions, Deep-Dive breakdowns, and a Quick Cheat Sheet).
2. A QUIZ (10 multiple-choice questions with 4 options each, correct answer index 0-3, and clear explanations).
3. FLASHCARDS (12-15 double-sided flashcards with a clear Question, Detailed Answer, Topic tag, and a helpful Hint).

Document Title: ${r}

Document Content:
${o}

OUTPUT RULES:
- Output MUST strictly be valid JSON adhering to the specified schema.
- The reviewer MUST be detailed, clear, organized, and helpful for exam preparation.
- Make all explanations encouraging, aesthetic, and crystal clear.
`;return await T(i,n,{type:"OBJECT",properties:{reviewer:{type:"OBJECT",properties:{title:{type:"STRING"},overview:{type:"STRING"},coreConcepts:{type:"ARRAY",items:{type:"OBJECT",properties:{concept:{type:"STRING"},summary:{type:"STRING"},details:{type:"ARRAY",items:{type:"STRING"}}},required:["concept","summary","details"]}},keyDefinitions:{type:"ARRAY",items:{type:"OBJECT",properties:{term:{type:"STRING"},definition:{type:"STRING"},context:{type:"STRING"}},required:["term","definition"]}},deepDive:{type:"ARRAY",items:{type:"OBJECT",properties:{topic:{type:"STRING"},content:{type:"STRING"}},required:["topic","content"]}},cheatSheet:{type:"ARRAY",items:{type:"STRING"}}},required:["title","overview","coreConcepts","keyDefinitions","deepDive","cheatSheet"]},quiz:{type:"ARRAY",items:{type:"OBJECT",properties:{id:{type:"INTEGER"},question:{type:"STRING"},options:{type:"ARRAY",items:{type:"STRING"}},correctIndex:{type:"INTEGER"},explanation:{type:"STRING"},topic:{type:"STRING"}},required:["id","question","options","correctIndex","explanation"]}},flashcards:{type:"ARRAY",items:{type:"OBJECT",properties:{id:{type:"INTEGER"},topic:{type:"STRING"},question:{type:"STRING"},answer:{type:"STRING"},hint:{type:"STRING"}},required:["id","topic","question","answer"]}}},required:["reviewer","quiz","flashcards"]})}export{S as generateStudyMaterial};
