test("Dom Works",()=>{
    document.body.innerHTML=
    `<button id="btn">Click ME <button>`;

    const button= document.querySelector("#btn");
    expect(button).not.toBeNull();
})