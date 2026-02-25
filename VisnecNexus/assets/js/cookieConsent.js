// cookieConsent.js
window.addEventListener("load", function () {
  if (!localStorage.getItem("cookieConsentV2")) {
    console.log("Showing cookie consent banner...");

    const wrapper = document.createElement("div");
    wrapper.className = "fixed bottom-0 inset-x-0 bg-black text-white text-sm p-4 flex flex-col md:flex-row justify-between items-center z-[10000]";

    const message = document.createElement("div");
    message.className = "mb-2 md:mb-0";
    message.innerHTML = 'This site uses cookies to enhance user experience and analyze traffic. <a href="/privacy.html" class="underline text-teal-400 ml-2" target="_blank">Learn More</a>';

    const buttons = document.createElement("div");
    buttons.className = "space-x-2";

    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Accept";
    acceptBtn.className = "bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded";
    acceptBtn.onclick = function () {
      localStorage.setItem("cookieConsentV2", "accepted");
      wrapper.remove();
    };

    const declineBtn = document.createElement("button");
    declineBtn.textContent = "Decline";
    declineBtn.className = "bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded";
    declineBtn.onclick = function () {
      localStorage.setItem("cookieConsentV2", "declined");
      wrapper.remove();
    };

    buttons.appendChild(acceptBtn);
    buttons.appendChild(declineBtn);
    wrapper.appendChild(message);
    wrapper.appendChild(buttons);
    document.body.appendChild(wrapper);
  }
});
