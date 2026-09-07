const setupAccordion= require("./accordion");

test("opens accordion when header is clicked",()=>{
    document.body.innerHTML=
    `<button id="header" aria-expanded="false">
      Section 1
      </button>
      
      <div id="panel" hidden>
      Content
      </div>`;

      setupAccordion();

      const header= document.querySelector("#header");
      const panel= document.querySelector("#panel");

      header.click();

      expect(header.getAttribute("aria-expanded")).toBe("true");

      expect(panel.hidden).toBe(false);
});