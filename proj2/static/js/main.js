document.addEventListener('DOMContentLoaded', function() {
  // Initialize dashboard
  initializeDashboard();
  
  // Initialize all dashboard components
  initializeStats();
  initializeFilters();
  initializeImageModal();
  initializeLoadingOverlay();
  initializeAnimations();
  
  // Mobile navigation toggle
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function() {
      navLinks.classList.toggle('show');
    });
  }
  
  // Flash message auto-hide with enhanced styling
  const flashMessages = document.querySelectorAll('.flash');
  if (flashMessages.length > 0) {
    flashMessages.forEach(function(flash) {
      // Style enhancement
      flash.style.cssText += `
        position: relative;
        border-radius: 0.5rem;
        padding: 1rem 1.5rem;
        margin-bottom: 1rem;
        border-left: 4px solid currentColor;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        animation: slideInDown 0.3s ease-out;
      `;
      
      setTimeout(function() {
        flash.style.opacity = '0';
        flash.style.transform = 'translateY(-20px)';
        flash.style.transition = 'all 0.5s ease';
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
  
  // Enhanced admin approve/reject buttons
  const approveButtons = document.querySelectorAll('.btn-approve');
  const rejectButtons = document.querySelectorAll('.btn-reject');
  
  if (approveButtons.length > 0) {
    approveButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const cardElement = document.querySelector(`.item-card[data-id="${itemId}"]`);
        
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Approving...';
        this.disabled = true;
        
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
            
            // Update UI with animation
            if (cardElement) {
              cardElement.classList.add('fade-out');
              setTimeout(() => {
                cardElement.remove();
                // Update stats
                initializeStats();
              }, 500);
            }
          } else {
            showNotification('Error: ' + data.error, 'error');
            // Restore button
            this.innerHTML = originalText;
            this.disabled = false;
          }
        })
        .catch(error => {
          showNotification('Error: ' + error, 'error');
          // Restore button
          this.innerHTML = originalText;
          this.disabled = false;
        });
      });
    });
  }
  
  if (rejectButtons.length > 0) {
    rejectButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const cardElement = document.querySelector(`.item-card[data-id="${itemId}"]`);
        
        if (confirm('Are you sure you want to reject this item?')) {
          // Show loading state
          const originalText = this.innerHTML;
          this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Rejecting...';
          this.disabled = true;
          
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
              
              // Update UI with animation
              if (cardElement) {
                cardElement.classList.add('fade-out');
                setTimeout(() => {
                  cardElement.remove();
                  // Update stats
                  initializeStats();
                }, 500);
              }
            } else {
              showNotification('Error: ' + data.error, 'error');
              // Restore button
              this.innerHTML = originalText;
              this.disabled = false;
            }
          })
          .catch(error => {
            showNotification('Error: ' + error, 'error');
            // Restore button
            this.innerHTML = originalText;
            this.disabled = false;
          });
        }
      });
    });
  }
  
  // Enhanced mark as returned button
  const returnButtons = document.querySelectorAll('.btn-return');
  
  if (returnButtons.length > 0) {
    returnButtons.forEach(function(button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const itemId = this.dataset.id;
        const statusBadge = document.querySelector(`.item-status[data-id="${itemId}"], .status-badge[data-id="${itemId}"]`);
        
        // Show loading state
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        this.disabled = true;
        
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
            
            // Update UI with animation
            if (statusBadge) {
              statusBadge.textContent = 'RETURNED';
              statusBadge.classList.remove('badge-lost', 'badge-found', 'badge-claimed');
              statusBadge.classList.add('badge-returned');
              statusBadge.style.animation = 'pulse 0.5s ease-out';
            }
            
            // Update button with success state
            this.innerHTML = '<i class="fas fa-check"></i> Returned';
            this.classList.remove('btn-success');
            this.classList.add('btn-secondary');
            
            // Update stats
            setTimeout(initializeStats, 100);
          } else {
            showNotification('Error: ' + data.error, 'error');
            // Restore button
            this.innerHTML = originalText;
            this.disabled = false;
          }
        })
        .catch(error => {
          showNotification('Error: ' + error, 'error');
          // Restore button
          this.innerHTML = originalText;
          this.disabled = false;
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
  
  // Image loading handler
  function handleImageLoading() {
    const images = document.querySelectorAll('.card-image img, .card-image');
    
    images.forEach(function(img) {
      if (img.tagName === 'IMG') {
        // Handle actual img elements
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
          // Hide broken image and show placeholder
          this.style.display = 'none';
          const placeholder = this.parentElement.querySelector('.placeholder-image');
          if (placeholder) {
            placeholder.style.display = 'flex';
          } else {
            // Create placeholder if it doesn't exist
            const newPlaceholder = document.createElement('div');
            newPlaceholder.className = 'placeholder-image';
            newPlaceholder.innerHTML = '<i class="fas fa-image"></i>';
            this.parentElement.appendChild(newPlaceholder);
          }
        });
        
        // If image is already loaded (cached)
        if (img.complete) {
          img.classList.add('loaded');
        }
      }
    });
  }
  
  // Initialize image loading
  handleImageLoading();
  
  // Re-initialize when new content is added (for dynamic content)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        handleImageLoading();
      }
    });
  });
  
  // Observe changes to the document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Dashboard Initialization
function initializeDashboard() {
  // Enhanced tab switching with animations
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  
  if (dashboardTabs.length > 0 && dashboardSections.length > 0) {
    dashboardTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const target = this.dataset.target;
        
        // Update active tab with animation
        dashboardTabs.forEach(t => {
          t.classList.remove('active');
          t.querySelector('.tab-indicator').style.width = '0';
        });
        this.classList.add('active');
        this.querySelector('.tab-indicator').style.width = '80%';
        
        // Show corresponding section with fade effect
        dashboardSections.forEach(function(section) {
          if (section.id === target) {
            section.style.display = 'block';
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            
            // Animate in
            setTimeout(() => {
              section.style.transition = 'all 0.3s ease';
              section.style.opacity = '1';
              section.style.transform = 'translateY(0)';
            }, 10);
            
            // Animate cards with stagger effect
            animateCards(section);
          } else {
            section.style.display = 'none';
          }
        });
      });
    });
  }
}

// Initialize Statistics Counter
function initializeStats() {
  // Count items and animate numbers
  const myItemsCount = document.querySelectorAll('#my-items .item-card').length;
  const pendingCount = document.querySelectorAll('#pending-approval .item-card').length;
  const totalItemsCount = document.querySelectorAll('#all-items .item-card').length;
  
  // Animate counters
  animateCounter('my-items-count', myItemsCount);
  animateCounter('pending-count', pendingCount);
  animateCounter('total-items-count', totalItemsCount);
  
  // Update pending badge
  const pendingBadge = document.getElementById('pending-badge');
  if (pendingBadge) {
    pendingBadge.textContent = pendingCount;
    if (pendingCount > 0) {
      pendingBadge.style.display = 'flex';
      pendingBadge.classList.add('pulse');
    }
  }
}

// Animate counter numbers
function animateCounter(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  let currentValue = 0;
  const increment = targetValue / 50; // 50 steps for smooth animation
  const timer = setInterval(() => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      currentValue = targetValue;
      clearInterval(timer);
    }
    element.textContent = Math.floor(currentValue);
  }, 20);
}

// Initialize Filters
function initializeFilters() {
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('search-input');
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterItems);
  }
  
  if (statusFilter) {
    statusFilter.addEventListener('change', filterItems);
  }
  
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterItems, 300); // Debounce search
    });
  }
}

// Filter Items
function filterItems() {
  const categoryFilter = document.getElementById('category-filter');
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('search-input');
  
  const categoryValue = categoryFilter ? categoryFilter.value.toLowerCase() : '';
  const statusValue = statusFilter ? statusFilter.value.toLowerCase() : '';
  const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
  
  // Get all item cards in the current active section
  const activeSection = document.querySelector('.dashboard-section[style*="block"], .dashboard-section:not([style*="none"])');
  if (!activeSection) return;
  
  const itemCards = activeSection.querySelectorAll('.item-card');
  let visibleCount = 0;
  
  itemCards.forEach(function(card) {
    const category = card.dataset.category ? card.dataset.category.toLowerCase() : '';
    const status = card.dataset.status ? card.dataset.status.toLowerCase() : '';
    const title = card.querySelector('.card-title') ? card.querySelector('.card-title').textContent.toLowerCase() : '';
    const description = card.querySelector('.card-description') ? card.querySelector('.card-description').textContent.toLowerCase() : '';
    
    const matchesCategory = !categoryValue || category.includes(categoryValue);
    const matchesStatus = !statusValue || status.includes(statusValue);
    const matchesSearch = !searchValue || title.includes(searchValue) || description.includes(searchValue);
    
    if (matchesCategory && matchesStatus && matchesSearch) {
      card.style.display = 'block';
      card.style.animation = 'fadeInUp 0.3s ease-out';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show/hide empty state
  updateEmptyState(activeSection, visibleCount);
}

// Update Empty State
function updateEmptyState(section, visibleCount) {
  let emptyState = section.querySelector('.empty-state');
  
  if (visibleCount === 0 && !emptyState) {
    // Create empty state for filtered results
    emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-icon">
        <i class="fas fa-search"></i>
      </div>
      <h3>No Items Found</h3>
      <p>Try adjusting your filters or search terms.</p>
    `;
    section.querySelector('.item-grid').appendChild(emptyState);
  } else if (visibleCount > 0 && emptyState && emptyState.querySelector('.fas.fa-search')) {
    // Remove filter empty state
    emptyState.remove();
  }
}

// Initialize Image Modal
function initializeImageModal() {
  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const modalClose = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');
  
  // Open modal on zoom button click
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('zoom-btn') || e.target.parentElement.classList.contains('zoom-btn')) {
      e.preventDefault();
      const button = e.target.classList.contains('zoom-btn') ? e.target : e.target.parentElement;
      const imageSrc = button.dataset.image;
      
      if (imageSrc && modal && modalImage) {
        modalImage.src = imageSrc;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Animate modal in
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.style.transition = 'opacity 0.3s ease';
          modal.style.opacity = '1';
        }, 10);
      }
    }
  });
  
  // Close modal
  function closeModal() {
    if (modal) {
      modal.style.opacity = '0';
      setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }, 300);
    }
  }
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
  }
  
  // Close on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

// Initialize Loading Overlay
function initializeLoadingOverlay() {
  const loadingOverlay = document.getElementById('loading-overlay');
  
  // Show loading on AJAX requests
  window.showLoading = function() {
    if (loadingOverlay) {
      loadingOverlay.classList.add('active');
    }
  };
  
  window.hideLoading = function() {
    if (loadingOverlay) {
      loadingOverlay.classList.remove('active');
    }
  };
}

// Initialize Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe dashboard sections
  document.querySelectorAll('.dashboard-section').forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });
}

// Animate Cards with Stagger Effect
function animateCards(container) {
  const cards = container.querySelectorAll('.item-card');
  cards.forEach(function(card, index) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.4s ease';
    
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100); // Stagger by 100ms
  });
}

// Enhanced Admin Functions
function initializeAdminControls() {
  const bulkApproveBtn = document.querySelector('.bulk-approve');
  const bulkRejectBtn = document.querySelector('.bulk-reject');
  const itemCheckboxes = document.querySelectorAll('.item-checkbox');
  
  if (itemCheckboxes.length > 0) {
    itemCheckboxes.forEach(function(checkbox) {
      checkbox.addEventListener('change', function() {
        const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
        
        if (bulkApproveBtn && bulkRejectBtn) {
          bulkApproveBtn.disabled = checkedBoxes.length === 0;
          bulkRejectBtn.disabled = checkedBoxes.length === 0;
        }
      });
    });
  }
  
  // Bulk approve
  if (bulkApproveBtn) {
    bulkApproveBtn.addEventListener('click', function() {
      const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
      const itemIds = Array.from(checkedBoxes).map(cb => cb.dataset.id);
      
      if (itemIds.length > 0) {
        bulkApproveItems(itemIds);
      }
    });
  }
  
  // Bulk reject
  if (bulkRejectBtn) {
    bulkRejectBtn.addEventListener('click', function() {
      const checkedBoxes = document.querySelectorAll('.item-checkbox:checked');
      const itemIds = Array.from(checkedBoxes).map(cb => cb.dataset.id);
      
      if (itemIds.length > 0 && confirm('Are you sure you want to reject these items?')) {
        bulkRejectItems(itemIds);
      }
    });
  }
}

// Bulk Approve Items
function bulkApproveItems(itemIds) {
  showLoading();
  
  Promise.all(itemIds.map(id => 
    fetch(`/admin/approve/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  ))
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(results => {
    hideLoading();
    const successCount = results.filter(r => r.success).length;
    showNotification(`${successCount} items approved successfully`, 'success');
    
    // Remove approved items with animation
    itemIds.forEach(id => {
      const card = document.querySelector(`.item-card[data-id="${id}"]`);
      if (card) {
        card.classList.add('fade-out');
        setTimeout(() => card.remove(), 500);
      }
    });
    
    // Update stats
    setTimeout(initializeStats, 600);
  })
  .catch(error => {
    hideLoading();
    showNotification('Error during bulk approval', 'error');
  });
}

// Bulk Reject Items
function bulkRejectItems(itemIds) {
  showLoading();
  
  Promise.all(itemIds.map(id => 
    fetch(`/admin/reject/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
  ))
  .then(responses => Promise.all(responses.map(r => r.json())))
  .then(results => {
    hideLoading();
    const successCount = results.filter(r => r.success).length;
    showNotification(`${successCount} items rejected`, 'success');
    
    // Remove rejected items with animation
    itemIds.forEach(id => {
      const card = document.querySelector(`.item-card[data-id="${id}"]`);
      if (card) {
        card.classList.add('fade-out');
        setTimeout(() => card.remove(), 500);
      }
    });
    
    // Update stats
    setTimeout(initializeStats, 600);
  })
  .catch(error => {
    hideLoading();
    showNotification('Error during bulk rejection', 'error');
  });
}

// Enhanced Notification System
function showNotification(message, type = 'info', duration = 5000) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 1050;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-left: 4px solid ${getNotificationColor(type)};
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);
  
  // Add close functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => removeNotification(notification));
  
  // Auto remove
  setTimeout(() => removeNotification(notification), duration);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  return icons[type] || icons.info;
}

function getNotificationColor(type) {
  const colors = {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6'
  };
  return colors[type] || colors.info;
}

function removeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => notification.remove(), 300);
}

// Initialize admin controls when page loads
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeAdminControls, 100);
});