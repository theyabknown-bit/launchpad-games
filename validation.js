<script>
// Form Validation with proper labels
document.addEventListener('DOMContentLoaded', function() {
    // Auto-add labels to inputs without labels
    document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="hidden"])').forEach(function(input) {
        if (!input.id) {
            input.id = 'field_' + Math.random().toString(36).substr(2, 9);
        }
        
        // Check if label exists
        const label = document.querySelector('label[for="' + input.id + '"]');
        if (!label) {
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', input.id);
            newLabel.textContent = input.placeholder || input.name || 'Field';
            input.parentNode.insertBefore(newLabel, input);
        }
    });
    
    // Form validation
    document.querySelectorAll('form').forEach(function(form) {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required]');
            let valid = true;
            
            inputs.forEach(function(input) {
                if (!input.value.trim()) {
                    const label = document.querySelector('label[for="' + input.id + '"]');
                    if (label) {
                        label.style.color = '#e17055';
                        label.textContent = label.textContent + ' (Required)';
                    }
                    valid = false;
                } else {
                    const label = document.querySelector('label[for="' + input.id + '"]');
                    if (label) {
                        label.style.color = '#00b894';
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});
</script>
