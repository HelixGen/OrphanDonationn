document.addEventListener('DOMContentLoaded', function () {
    // Select elements
    const homeLink = document.querySelector('a[href="#home"]');  // Home link
    const orphanageLink = document.querySelector('a[href="#orphanage"]'); // Our Orphanage link
    const adoptionLink = document.querySelector('a[href="#adoption"]'); // Adoption link
    const quoteLink = document.querySelector('a[href="#quote"]'); // Our Quote link
    const signUpButton = document.querySelector('.sign-up'); // Sign Up button
    
    // Scroll to specific sections
    const cardSection = document.querySelector('.cards-section');
    const footerSection = document.querySelector('.footer');

    // Refresh page when Home link is clicked
    if (homeLink) {
      homeLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        location.reload(); // Reload the page
      });
    }

    // Scroll to Our Orphanage (cards section)
    if (orphanageLink) {
      orphanageLink.addEventListener('click', function(event) {
        event.preventDefault();
        cardSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Redirect to Login page when Adoption link is clicked
    if (adoptionLink) {
      adoptionLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.location.href = '/auth/login'; // Replace with actual login route
      });
    }

    // Scroll to Quotes section (footer)
    if (quoteLink) {
      quoteLink.addEventListener('click', function(event) {
        event.preventDefault();
        footerSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Redirect to Register page when Sign Up button is clicked
    if (signUpButton) {
      signUpButton.addEventListener('click', function() {
        window.location.href = '/auth/register'; // Replace with actual register route
      });
    }
  });
  
  
  
