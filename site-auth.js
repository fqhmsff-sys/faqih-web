(function () {
  "use strict";

  document.body.classList.add("site-locked");

  const gate = document.createElement("div");
  gate.id = "siteAuthGate";

  gate.innerHTML = `
    <div class="site-auth-box">
      <p class="eyebrow">PROTECTED</p>
      <h1>FAQIH</h1>
      <p>Halaman ini membutuhkan sandi.</p>

      <form id="siteAuthForm">
        <input
          id="siteAuthPassword"
          type="password"
          placeholder="Masukkan sandi"
          autocomplete="current-password"
          required
        >

        <button type="submit">
          BUKA
        </button>
      </form>

      <p
        id="siteAuthError"
        class="error"
        aria-live="polite"
      ></p>
    </div>
  `;

  document.body.appendChild(gate);


  const style = document.createElement("style");

  style.textContent = `
    body.site-locked > *:not(#siteAuthGate) {
      visibility: hidden !important;
    }

    #siteAuthGate {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: #fff;
      color: #111;
      visibility: visible !important;
    }

    .site-auth-box {
      width: min(100%, 430px);
      padding: 42px 32px;
      border: 1px solid #ddd;
      background: #fff;
      text-align: center;
    }

    .site-auth-box h1 {
      margin: 8px 0 12px;
      font-size: clamp(42px, 10vw, 72px);
      letter-spacing: -.06em;
    }

    .site-auth-box > p:not(.eyebrow):not(.error) {
      margin: 0 0 26px;
      color: #666;
    }

    #siteAuthForm {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    #siteAuthPassword {
      width: 100%;
      box-sizing: border-box;
      padding: 14px 15px;
      border: 1px solid #ccc;
      background: #fff;
      color: #111;
      font: inherit;
      outline: none;
    }

    #siteAuthPassword:focus {
      border-color: #111;
    }

    #siteAuthForm button {
      width: 100%;
      padding: 14px 15px;
      border: 1px solid #111;
      background: #111;
      color: #fff;
      font: inherit;
      cursor: pointer;
    }

    #siteAuthForm button:disabled {
      opacity: .6;
      cursor: wait;
    }

    #siteAuthGate .error {
      min-height: 20px;
      margin: 14px 0 0;
      color: #b00020;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      .site-auth-box {
        padding: 34px 22px;
      }
    }
  `;

  document.head.appendChild(style);


  function b64ToBytes(value) {
    return Uint8Array.from(
      atob(value),
      c => c.charCodeAt(0)
    );
  }


  async function verifyPassword(password) {

    if (
      !window.crypto ||
      !window.crypto.subtle
    ) {
      throw new Error("SECURE_CONTEXT");
    }


    if (!window.PRIVATE_BUNDLE) {
      throw new Error("NO_BUNDLE");
    }


    const bundle =
      window.PRIVATE_BUNDLE;


    const material =
      await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveKey"]
      );


    const key =
      await crypto.subtle.deriveKey(

        {
          name: "PBKDF2",
          salt:
            b64ToBytes(bundle.salt),
          iterations:
            bundle.iterations,
          hash: "SHA-256"
        },

        material,

        {
          name: "AES-GCM",
          length: 256
        },

        false,

        ["decrypt"]

      );


    await crypto.subtle.decrypt(

      {
        name: "AES-GCM",
        iv:
          b64ToBytes(bundle.nonce)
      },

      key,

      b64ToBytes(bundle.ciphertext)

    );


    return true;

  }


  document
    .getElementById("siteAuthForm")
    .addEventListener(
      "submit",
      async function (event) {

        event.preventDefault();


        const input =
          document.getElementById(
            "siteAuthPassword"
          );

        const button =
          this.querySelector("button");

        const error =
          document.getElementById(
            "siteAuthError"
          );


        const password =
          input.value;


        error.textContent = "";

        button.disabled = true;

        button.textContent =
          "MEMERIKSA...";


        try {

          await verifyPassword(
            password
          );


          /*
            Simpan password hanya selama
            halaman ini aktif.

            Ini diperlukan oleh
            word-editor.html untuk
            decrypt/encrypt data Words.
          */

          window.siteAuthPassword =
            password;


          document.body.classList.remove(
            "site-locked"
          );


          gate.remove();

          style.remove();


        } catch (err) {

          if (
            err.message ===
            "SECURE_CONTEXT"
          ) {

            error.textContent =
              "Buka website melalui HTTPS, misalnya GitHub Pages.";

          } else if (
            err.message ===
            "NO_BUNDLE"
          ) {

            error.textContent =
              "Data private tidak ditemukan.";

          } else {

            error.textContent =
              "Sandi salah.";

          }


          input.value = "";

          input.focus();

          button.disabled = false;

          button.textContent =
            "BUKA";

        }

      }
    );

})();