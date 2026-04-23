// Global Contact Information Dynamic Loader
(function() {
    // Supabase Init
    const supabaseUrl = 'https://caiambiptiuuxtdyacmx.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaWFtYmlwdGl1dXh0ZHlhY214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjAwMzYsImV4cCI6MjA5MTIzNjAzNn0.V60E1xXqvICAFS8RKP_2DFLWm2SVcZ9WcxmdE1QTDS4';
    const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

    async function updateGlobalContactInfo() {
        try {
            const { data, error } = await _supabase
                .from('contact_settings')
                .select('*')
                .eq('id', 1)
                .single();

            if (error) throw error;
            if (!data) return;

            // 1. Update all Phone Primary occurrences
            document.querySelectorAll('.dynamic-phone-primary').forEach(el => {
                el.textContent = data.phone_primary;
                if (el.tagName === 'A') el.href = `tel:${data.phone_primary.replace(/\s/g, '')}`;
            });

            // 2. Update all Phone Secondary occurrences
            document.querySelectorAll('.dynamic-phone-secondary').forEach(el => {
                el.textContent = data.phone_secondary;
                if (el.tagName === 'A') el.href = `tel:${data.phone_secondary.replace(/\s/g, '')}`;
            });

            // 3. Update all Email occurrences
            document.querySelectorAll('.dynamic-email').forEach(el => {
                el.textContent = data.email;
                if (el.tagName === 'A') el.href = `mailto:${data.email}`;
            });

            // 4. Update all Location occurrences
            document.querySelectorAll('.dynamic-location').forEach(el => {
                el.textContent = data.location;
            });

            // 5. Update Social Links Dynamically
            const { data: socialData, error: socialError } = await _supabase
                .from('social_links')
                .select('*')
                .eq('is_active', true)
                .order('id');

            if (!socialError && socialData) {
                const containers = document.querySelectorAll('.social-icons');
                containers.forEach(container => {
                    container.innerHTML = ''; // Clear existing
                    socialData.forEach(link => {
                        const a = document.createElement('a');
                        a.href = link.url;
                        a.target = '_blank';
                        a.innerHTML = `<i class="${link.icon_class}"></i>`;
                        container.appendChild(a);
                    });
                });

                // Also update floating whatsapp if any
                const waLink = socialData.find(l => l.platform_name.toLowerCase() === 'whatsapp');
                if (waLink) {
                    document.querySelectorAll('.floating-whatsapp').forEach(el => {
                        el.href = waLink.url;
                    });
                }
            }

        } catch (err) {
            console.error('Global contact fetch error:', err);
        }
    }

    document.addEventListener('DOMContentLoaded', updateGlobalContactInfo);
})();
