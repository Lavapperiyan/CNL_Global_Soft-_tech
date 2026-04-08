// Supabase Configuration
const supabaseUrl = 'https://caiambiptiuuxtdyacmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaWFtYmlwdGl1dXh0ZHlhY214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjAwMzYsImV4cCI6MjA5MTIzNjAzNn0.V60E1xXqvICAFS8RKP_2DFLWm2SVcZ9WcxmdE1QTDS4';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements
const servicesBody = document.getElementById('servicesBody');
const loadingOverlay = document.getElementById('loadingOverlay');
const serviceModal = document.getElementById('serviceModal');
const serviceForm = document.getElementById('serviceForm');
const countTotal = document.getElementById('countTotal');
const countFeatured = document.getElementById('countFeatured');
const searchInput = document.getElementById('searchInput');

let allServices = [];

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadServices();
});

// Authentication Guard
async function checkAuth() {
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
    }
    loadingOverlay.style.display = 'none';
}

// Fetch and Render Services
async function loadServices() {
    try {
        const { data, error } = await _supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allServices = data;
        renderServices(data);
        updateStats(data);
    } catch (error) {
        console.error('Error loading services:', error.message);
        alert('Failed to load services. Check console.');
    }
}

function renderServices(services) {
    servicesBody.innerHTML = '';
    services.forEach(service => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="service-info">
                    <div class="icon-box"><i class="fas ${service.icon}"></i></div>
                    <div style="font-weight: 600;">${service.title}</div>
                </div>
            </td>
            <td><code style="color: var(--text-dim)">${service.icon}</code></td>
            <td id="price-${service.id}">${getPriceSummary(service.pricing)}</td>
            <td>
                <span class="badge ${service.is_featured ? 'badge-success' : 'badge-warn'}">
                    ${service.is_featured ? 'Featured' : 'Standard'}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="editService('${service.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteService('${service.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        servicesBody.appendChild(tr);
    });
}

function getPriceSummary(pricing) {
    if (!pricing || !Array.isArray(pricing) || pricing.length === 0) return 'N/A';
    return pricing[0].value + (pricing.length > 1 ? '+' : '');
}

function updateStats(services) {
    countTotal.innerText = services.length;
    countFeatured.innerText = services.filter(s => s.is_featured).length;
}

// Modal Management
window.openModal = (isEdit = false) => {
    document.getElementById('modalTitle').innerText = isEdit ? 'Edit Service' : 'Create New Service';
    serviceModal.style.display = 'flex';
};

window.closeModal = () => {
    serviceModal.style.display = 'none';
    serviceForm.reset();
    document.getElementById('serviceId').value = '';
};

document.getElementById('openModalBtn').onclick = () => openModal();

// Create/Update Logic
serviceForm.onsubmit = async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

    const id = document.getElementById('serviceId').value;
    const title = document.getElementById('title').value;
    const heading = document.getElementById('heading').value;
    const short_desc = document.getElementById('short_desc').value;
    const detailed_desc = document.getElementById('detailed_desc').value;
    const icon = document.getElementById('icon').value;
    const is_featured = document.getElementById('is_featured').value === 'true';
    const inclusions = document.getElementById('inclusions').value.split(',').map(i => i.trim()).filter(i => i);
    
    let pricing = [];
    try {
        const pricingText = document.getElementById('pricing').value.trim();
        pricing = pricingText ? JSON.parse(pricingText) : [];
    } catch (e) {
        alert('Invalid Pricing JSON. Please use format: [{"label": "Standard", "value": "Rs. 1000"}]');
        saveBtn.disabled = false;
        saveBtn.innerText = 'SAVE SERVICE';
        return;
    }

    const special_offer = document.getElementById('special_offer').value;

    const serviceData = {
        title, heading, short_desc, detailed_desc, icon, is_featured, inclusions, pricing, special_offer
    };

    try {
        let result;
        if (id) {
            result = await _supabase.from('services').update(serviceData).eq('id', id);
        } else {
            result = await _supabase.from('services').insert([serviceData]);
        }

        if (result.error) throw result.error;

        await loadServices();
        closeModal();
    } catch (error) {
        alert('Error saving service: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = 'SAVE SERVICE';
    }
};

// Edit Logic
window.editService = (id) => {
    const service = allServices.find(s => s.id === id);
    if (!service) return;

    document.getElementById('serviceId').value = service.id;
    document.getElementById('title').value = service.title;
    document.getElementById('heading').value = service.heading || '';
    document.getElementById('short_desc').value = service.short_desc;
    document.getElementById('detailed_desc').value = service.detailed_desc;
    document.getElementById('icon').value = service.icon;
    document.getElementById('is_featured').value = service.is_featured ? 'true' : 'false';
    document.getElementById('inclusions').value = (service.inclusions || []).join(', ');
    document.getElementById('pricing').value = JSON.stringify(service.pricing || []);
    document.getElementById('special_offer').value = service.special_offer || '';

    openModal(true);
};

// Delete Logic
window.deleteService = async (id) => {
    if (!confirm('Are you sure you want to delete this service permanently?')) return;

    try {
        const { error } = await _supabase.from('services').delete().eq('id', id);
        if (error) throw error;
        await loadServices();
    } catch (error) {
        alert('Delete failed: ' + error.message);
    }
};

// Logout
document.getElementById('logoutBtn').onclick = async () => {
    await _supabase.auth.signOut();
    window.location.href = 'login.html';
};

// Search Filter
searchInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allServices.filter(s => 
        s.title.toLowerCase().includes(term) || 
        s.short_desc.toLowerCase().includes(term)
    );
    renderServices(filtered);
};
