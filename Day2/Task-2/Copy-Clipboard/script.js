const code= document.querySelector("#code");

const copyBtn= document.querySelector("#copyBtn");

const message= document.querySelector("#message");

copyBtn.addEventListener("click", async()=>{
  await navigator.clipboard.writeText(code.textContent);

  copyBtn.textContent="copied!"
})