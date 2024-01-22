document.addEventListener("DOMContentLoaded", async (e) => {
  // Declare variables using const
  const loginForm = document.querySelector(".my-form");
  const loader = document.getElementById("hidden");
  const showToast = (message, type) => {
    Toastify({
      text: message,
      duration: 5000,
      style: {
        background: type === "success" ? "#2ecc71" : "#e74c3c",
      },
    }).showToast();
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.style.display = "block"; // Show the loader

    // Get user input using template literals
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log(` ${email}, ${password}`);

    try {
      // Use async and await to simplify the fetch call
      const response = await fetch(
        "https://atmospherenow.onrender.com/api/sign-in",
        // "http://localhost:3936/api/sign-in",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const content = await response.json();
      console.log(content);

      // Store the access token and the refresh token in the localStorage
      localStorage.setItem("accessToken", content.accessToken);
      localStorage.setItem("refreshToken", content.refreshToken);

      // Hide the loader regardless of the response status
      loader.style.display = "none";

      // Use switch statement to handle different response statuses
      switch (response.status) {
        case 200:
          showToast(content.message, "success");
          loginForm.reset();
          // Handle successful login (e.g., redirect)
          window.location.href = "./pages/report.html";
          break;
        case 400:
          if (content.errors) {
            // Check for specific field errors
            if (content.errors.email) {
              showToast(content.errors.email[0], "error");
            }
            if (content.errors.password) {
              showToast(content.errors.password[0], "error");
            }
          } else {
            // Handle other validation errors
            showToast(
              content.message || "Invalid information provided",
              "error"
            );
          }
          break;
        case 500:
          showToast(content.message, "error");
          break;
        default:
          showToast(content.message || "Unknown response status", "error");
      }
    } catch (error) {
      console.error("Error during API request:", error);
      showToast("An error occurred during the request", "error");
    }
  });
});
