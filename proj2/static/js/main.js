document.addEventListener('DOMContentLoaded', function() {
  // Mobile navigation toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }
  
  // Flash message auto-hide
  const flashMessages = document.querySelectorAll('.flash');
  if (flashMessages.length > 0) {
    flashMessages.forEach(function(flash) {
      setTimeout(function() {
        flash.style.opacity = '0';
        flash.style.transition = 'opacity 0.5s ease';
        setTimeout(function() {
          flash.remove();
        }, 500);
      }, 5000);
    });
  }
  
  // Image preview for file inputs
  const fileInput = document.querySelector('input[type="file"]');
  const imagePreview = document.querySelector('.image-preview');
  
  if (fileInput && imagePreview) {
    fileInput.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Image preview" class="preview-img">`;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.innerHTML = '';
        imagePreview.style.display = 'none';
      }
    });
  }
  
  // Dashboard tabs
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  
  if (dashboardTabs.length > 0 && dashboardSections.length > 0) {
    dashboardTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const target = this.dataset.target;
        
        // Update active tab
        dashboardTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // Show corresponding section
        dashboardSections.forEach(function(section) {
          if (section.id === target) {
            section.style.display = 'block';
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }
  
  // Admin approve/reject buttons
  const approveButtons = document.querySelectorAll('.btn-approve');
  const rejectButtons = document.querySelectorAll('.btn-reject');
  
  if (approveButtons.length > 0) {
    approveButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const cardElement = document.querySelector(`.card[data-id="${itemId}"]`);
        
        fetch(`/admin/approve/${itemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Show success message
            showNotification('Item approved successfully', 'success');
            
            // Update UI
            if (cardElement) {
              cardElement.classList.add('fade-out');
              setTimeout(() => {
                cardElement.remove();
              }, 500);
            }
          } else {
            showNotification('Error: ' + data.error, 'error');
          }
        })
        .catch(error => {
          showNotification('Error: ' + error, 'error');
        });
      });
    });
  }
  
  if (rejectButtons.length > 0) {
    rejectButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const cardElement = document.querySelector(`.card[data-id="${itemId}"]`);
        
        if (confirm('Are you sure you want to reject this item?')) {
          fetch(`/admin/reject/${itemId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              // Show success message
              showNotification('Item rejected', 'success');
              
              // Update UI
              if (cardElement) {
                cardElement.classList.add('fade-out');
                setTimeout(() => {
                  cardElement.remove();
                }, 500);
              }
            } else {
              showNotification('Error: ' + data.error, 'error');
            }
          })
          .catch(error => {
            showNotification('Error: ' + error, 'error');
          });
        }
      });
    });
  }
  
  // Mark as returned button
  const returnButtons = document.querySelectorAll('.btn-return');
  
  if (returnButtons.length > 0) {
    returnButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const statusBadge = document.querySelector(`.item-status[data-id="${itemId}"]`);
        
        fetch(`/mark_returned/${itemId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Show success message
            showNotification('Item marked as returned', 'success');
            
            // Update UI
            if (statusBadge) {
              statusBadge.textContent = 'RETURNED';
              statusBadge.classList.remove('badge-lost', 'badge-found', 'badge-claimed');
              statusBadge.classList.add('badge-returned');
            }
            
            // Disable the button
            this.disabled = true;
            this.textContent = 'Returned';
            this.classList.remove('btn-success');
            this.classList.add('btn-secondary');
          } else {
            showNotification('Error: ' + data.error, 'error');
          }
        })
        .catch(error => {
          showNotification('Error: ' + error, 'error');
        });
      });
    });
  }
  
  // Claim modal
  const claimButtons = document.querySelectorAll('.btn-claim');
  const claimModal = document.querySelector('.claim-modal');
  const closeModalButtons = document.querySelectorAll('.close-modal');
  
  if (claimButtons.length > 0 && claimModal) {
    claimButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const itemId = this.dataset.id;
        const itemNameEl = document.querySelector('.item-title');
        const itemName = itemNameEl ? itemNameEl.textContent : 'this item';
        
        // Update modal content
        const modalTitle = claimModal.querySelector('.modal-title');
        if (modalTitle) {
          modalTitle.textContent = `Claim Request for ${itemName}`;
        }
        
        const itemIdInput = claimModal.querySelector('input[name="item_id"]');
        if (itemIdInput) {
          itemIdInput.value = itemId;
        }
        
        // Show modal
        claimModal.style.display = 'flex';
        setTimeout(() => {
          claimModal.classList.add('show');
        }, 10);
      });
    });
  }
  
  if (closeModalButtons.length > 0) {
    closeModalButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        // Close any open modal
        const modals = document.querySelectorAll('.modal');
        modals.forEach(function(modal) {
          modal.classList.remove('show');
          setTimeout(() => {
            modal.style.display = 'none';
          }, 300);
        });
      });
    });
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
      if (event.target === modal) {
        modal.classList.remove('show');
        setTimeout(() => {
          modal.style.display = 'none';
        }, 300);
      }
    });
  });
  
  // Lightbox for images
  const itemImages = document.querySelectorAll('.item-image img, .card-image img');
  if (itemImages.length > 0) {
    itemImages.forEach(function(img) {
      img.addEventListener('click', function() {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <span class="close-lightbox">&times;</span>
            <img src="${this.src}" alt="Enlarged image">
          </div>
        `;
        document.body.appendChild(lightbox);
        
        // Show lightbox
        setTimeout(() => {
          lightbox.classList.add('show');
        }, 10);
        
        // Close lightbox on click
        lightbox.addEventListener('click', function() {
          this.classList.remove('show');
          setTimeout(() => {
            this.remove();
          }, 300);
        });
      });
    });
  }
  
  // Helper function to show notifications
  function showNotification(message, type) {
    const notifContainer = document.querySelector('.notification-container');
    
    if (!notifContainer) {
      // Create notification container if it doesn't exist
      const container = document.createElement('div');
      container.className = 'notification-container';
      document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification ' + (type ? 'notification-' + type : '');
    notification.innerHTML = message;
    
    document.querySelector('.notification-container').appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }
  
  // Add animation to cards when they come into view
  const animateOnScroll = function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(function(card) {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (cardPosition < screenPosition) {
        card.classList.add('slide-up');
      }
    });
  };
  
  window.addEventListener('scroll', animateOnScroll);
  // Trigger once on load
  setTimeout(animateOnScroll, 100);
});