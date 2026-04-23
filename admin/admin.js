// Supabase Configuration
const supabaseUrl = 'https://caiambiptiuuxtdyacmx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhaWFtYmlwdGl1dXh0ZHlhY214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NjAwMzYsImV4cCI6MjA5MTIzNjAzNn0.V60E1xXqvICAFS8RKP_2DFLWm2SVcZ9WcxmdE1QTDS4';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// DOM Elements - Services
const servicesBody = document.getElementById('servicesBody');
const loadingOverlay = document.getElementById('loadingOverlay');
const serviceModal = document.getElementById('serviceModal');
const serviceForm = document.getElementById('serviceForm');
const countTotal = document.getElementById('countTotal');
const countFeatured = document.getElementById('countFeatured');
const searchInput = document.getElementById('searchInput');

// DOM Elements - Offers
const offersBody = document.getElementById('offersBody');
const offerModal = document.getElementById('offerModal');
const offerForm = document.getElementById('offerForm');
const countTotalOffers = document.getElementById('countTotalOffers');
const countActiveOffers = document.getElementById('countActiveOffers');
const searchOfferInput = document.getElementById('searchOfferInput');

// Sections
const servicesTableCard = document.getElementById('servicesTableCard');
const offersTableCard = document.getElementById('offersTableCard');
const aboutCard = document.getElementById('aboutCard');

const servicesStats = document.getElementById('servicesStats');
const offersStats = document.getElementById('offersStats');

const navServices = document.getElementById('navServices');
const navOffers = document.getElementById('navOffers');
const navAbout = document.getElementById('navAbout');
const navHome = document.getElementById('navHome');
const navAnalytics = document.getElementById('navAnalytics');
const navContact = document.getElementById('navContact');
const navCustomers = document.getElementById('navCustomers');

const openModalBtn = document.getElementById('openModalBtn'); // Top right button
const headerTitle = document.querySelector('.header h1');
const headerDesc = document.querySelector('.header p');

const aboutForm = document.getElementById('aboutForm');
const homeForm = document.getElementById('homeForm');
const contactInfoForm = document.getElementById('contactInfoForm');

// Contact Elements
const contactPhonePrimary = document.getElementById('contact_phone_primary');
const contactPhoneSecondary = document.getElementById('contact_phone_secondary');
const contactEmail = document.getElementById('contact_email');
const contactLocation = document.getElementById('contact_location');
const contactFacebook = document.getElementById('contact_facebook');
const contactInstagram = document.getElementById('contact_instagram');
const contactWhatsapp = document.getElementById('contact_whatsapp');
const contactInfoCard = document.getElementById('contactInfoCard');

// Social Links Elements
const socialLinksBody = document.getElementById('socialLinksBody');
const socialModal = document.getElementById('socialModal');
const socialForm = document.getElementById('socialForm');
const socialModalTitle = document.getElementById('socialModalTitle');
const saveSocialBtn = document.getElementById('saveSocialBtn');

// Customer Elements
const customersCard = document.getElementById('customersCard');
const customersBody = document.getElementById('customersBody');
const customersStats = document.getElementById('customersStats');
const totalCustomers = document.getElementById('totalCustomers');
const activeCustomers = document.getElementById('activeCustomers');
const customerSearch = document.getElementById('customerSearch');
const promotionModal = document.getElementById('promotionModal');

let allCustomers = [];
let allSocialLinks = [];

// Analytics Elements
const analyticsStats = document.getElementById('analyticsStats');
const analyticsCard = document.getElementById('analyticsCard');
const totalPageViews = document.getElementById('totalPageViews');
const lastVisitTime = document.getElementById('lastVisitTime');

// Home Page Elements
const homeHeroBadge = document.getElementById('home_hero_badge');
const homeHeroTitle = document.getElementById('home_hero_title');
const homeHeroDesc = document.getElementById('home_hero_desc');
const homeHeroSubtext = document.getElementById('home_hero_subtext');
const homeStat1Num = document.getElementById('home_stat1_num');
const homeStat1Label = document.getElementById('home_stat1_label');
const homeStat2Num = document.getElementById('home_stat2_num');
const homeStat2Label = document.getElementById('home_stat2_label');
const homeStat3Num = document.getElementById('home_stat3_num');
const homeStat3Label = document.getElementById('home_stat3_label');
const homeCard = document.getElementById('homeCard');

let allServices = [];
let allOffers = [];
let currentSection = 'services'; // 'services', 'offers', 'about'

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadServices();
    await loadOffers();
    await loadAbout();
    await loadHome();
    await loadAnalytics();
    await loadContact();
    await loadSocialLinks();
    await loadCustomers();
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

// Fetch and Render Offers
async function loadOffers() {
    try {
        const { data, error } = await _supabase
            .from('offers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        allOffers = data;
        renderOffers(data);
        updateOfferStats(data);
    } catch (error) {
        console.error('Error loading offers:', error.message);
        // Only alert if they are on the offers tab, or log to console
    }
}

function renderOffers(offers) {
    offersBody.innerHTML = '';
    offers.forEach(offer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="service-info">
                    <div class="icon-box"><i class="fas ${offer.icon}"></i></div>
                    <div style="font-weight: 600;">${offer.title}</div>
                </div>
            </td>
            <td><code style="color: var(--text-dim)">${offer.icon}</code></td>
            <td><span class="badge" style="background: rgba(0, 156, 166, 0.2); color: var(--primary-cyan);">${offer.tag || '-'}</span></td>
            <td>
                <span class="badge ${offer.is_active ? 'badge-success' : 'badge-warn'}">
                    ${offer.is_active ? 'Active' : 'Hidden'}
                </span>
            </td>
            <td>
                <div class="actions">
                    <button class="btn-icon" onclick="editOffer('${offer.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="deleteOffer('${offer.id}')" title="Delete"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        offersBody.appendChild(tr);
    });
}

function updateOfferStats(offers) {
    countTotalOffers.innerText = offers.length;
    countActiveOffers.innerText = offers.filter(o => o.is_active).length;
}

// Fetch About Us
async function loadAbout() {
    try {
        const { data, error } = await _supabase
            .from('about_content')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) {
            // Table might not exist yet, or row doesn't exist
            console.error('Error loading about content:', error.message);
            return;
        }

        if (data) {
            document.getElementById('about_title').value = data.title || '';
            document.getElementById('about_description').value = data.description || '';
        }
    } catch (err) {
        console.error('Load about catch:', err);
    }
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

window.openOfferModal = (isEdit = false) => {
    document.getElementById('offerModalTitle').innerText = isEdit ? 'Edit Offer' : 'Create New Offer';
    offerModal.style.display = 'flex';
};

window.closeOfferModal = () => {
    offerModal.style.display = 'none';
    offerForm.reset();
    document.getElementById('offerId').value = '';
};

document.getElementById('openModalBtn').onclick = () => {
    if (currentSection === 'services') openModal();
    else if (currentSection === 'offers') openOfferModal();
};

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

offerForm.onsubmit = async (e) => {
    e.preventDefault();
    const saveBtn = document.getElementById('saveOfferBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

    const id = document.getElementById('offerId').value;
    const title = document.getElementById('offer_title').value;
    const description = document.getElementById('offer_description').value;
    const icon = document.getElementById('offer_icon').value;
    const tag = document.getElementById('offer_tag').value;
    const features = document.getElementById('offer_features').value.split(',').map(i => i.trim()).filter(i => i);
    const is_active = document.getElementById('offer_is_active').value === 'true';

    const offerData = {
        title, description, icon, tag, features, is_active
    };

    try {
        let result;
        if (id) {
            result = await _supabase.from('offers').update(offerData).eq('id', id);
        } else {
            result = await _supabase.from('offers').insert([offerData]);
        }

        if (result.error) throw result.error;

        await loadOffers();
        closeOfferModal();
    } catch (error) {
        alert('Error saving offer: ' + error.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = 'SAVE OFFER';
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

window.editOffer = (id) => {
    const offer = allOffers.find(o => o.id === id);
    if (!offer) return;

    document.getElementById('offerId').value = offer.id;
    document.getElementById('offer_title').value = offer.title;
    document.getElementById('offer_description').value = offer.description;
    document.getElementById('offer_icon').value = offer.icon;
    document.getElementById('offer_tag').value = offer.tag || '';
    document.getElementById('offer_features').value = (offer.features || []).join(', ');
    document.getElementById('offer_is_active').value = offer.is_active ? 'true' : 'false';

    openOfferModal(true);
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

window.deleteOffer = async (id) => {
    if (!confirm('Are you sure you want to delete this offer permanently?')) return;

    try {
        const { error } = await _supabase.from('offers').delete().eq('id', id);
        if (error) throw error;
        await loadOffers();
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

searchOfferInput.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allOffers.filter(o => 
        o.title.toLowerCase().includes(term) || 
        o.description.toLowerCase().includes(term)
    );
    renderOffers(filtered);
};

// Save About Us
if (aboutForm) {
    aboutForm.onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('saveAboutBtn');
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

        const title = document.getElementById('about_title').value;
        const description = document.getElementById('about_description').value;

        try {
            const { error } = await _supabase
                .from('about_content')
                .upsert([{ id: 1, title, description }]); // Upsert relies on id = 1

            if (error) throw error;
            alert('About Us information updated successfully!');
        } catch (error) {
            alert('Error saving about us. Did you create the table? ' + error.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'SAVE CHANGES';
        }
    };
}

// Navigation Toggles
navServices.onclick = (e) => {
    e.preventDefault();
    currentSection = 'services';
    navServices.classList.add('active');
    navOffers.classList.remove('active');
    navAbout.classList.remove('active');
    
    servicesStats.style.display = 'grid';
    servicesTableCard.style.display = 'block';
    
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    aboutCard.style.display = 'none';
    
    headerTitle.innerText = 'Services Management';
    headerDesc.innerText = 'Control your dynamic service catalog real-time.';
    openModalBtn.style.display = 'inline-flex';
    openModalBtn.innerHTML = '<i class="fas fa-plus"></i> New Service';
};

navOffers.onclick = (e) => {
    e.preventDefault();
    currentSection = 'offers';
    navOffers.classList.add('active');
    navServices.classList.remove('active');
    navAbout.classList.remove('active');
    
    offersStats.style.display = 'grid';
    offersTableCard.style.display = 'block';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    aboutCard.style.display = 'none';
    
    headerTitle.innerText = 'Offers Management';
    headerDesc.innerText = 'Manage dynamic website banners and special offers.';
    openModalBtn.style.display = 'inline-flex';
    openModalBtn.innerHTML = '<i class="fas fa-plus"></i> New Offer';
};

navAbout.onclick = (e) => {
    e.preventDefault();
    currentSection = 'about';
    navAbout.classList.add('active');
    navServices.classList.remove('active');
    navOffers.classList.remove('active');
    navHome.classList.remove('active');
    
    aboutCard.style.display = 'block';
    homeCard.style.display = 'none';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    
    headerTitle.innerText = 'About Us Management';
    headerDesc.innerText = 'Update your company profile and information.';
    openModalBtn.style.display = 'none'; // Hide add button for About Us
};

navHome.onclick = (e) => {
    e.preventDefault();
    currentSection = 'home';
    navHome.classList.add('active');
    navServices.classList.remove('active');
    navOffers.classList.remove('active');
    navAbout.classList.remove('active');
    navAnalytics.classList.remove('active');
    
    homeCard.style.display = 'block';
    aboutCard.style.display = 'none';
    analyticsCard.style.display = 'none';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    analyticsStats.style.display = 'none';
    
    headerTitle.innerText = 'Home Page Management';
    headerDesc.innerText = 'Edit the hero section and statistics of your homepage.';
    openModalBtn.style.display = 'none';
};

navAnalytics.onclick = (e) => {
    e.preventDefault();
    currentSection = 'analytics';
    navAnalytics.classList.add('active');
    navServices.classList.remove('active');
    navOffers.classList.remove('active');
    navAbout.classList.remove('active');
    navHome.classList.remove('active');
    navContact.classList.remove('active');
    
    analyticsCard.style.display = 'block';
    analyticsStats.style.display = 'grid';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    aboutCard.style.display = 'none';
    homeCard.style.display = 'none';
    contactInfoCard.style.display = 'none';
    
    headerTitle.innerText = 'Website Analytics';
    headerDesc.innerText = 'Monitor your website traffic and visitor engagement.';
    openModalBtn.style.display = 'none';
    
    loadAnalytics();
};

navCustomers.onclick = (e) => {
    e.preventDefault();
    currentSection = 'customers';
    navCustomers.classList.add('active');
    navServices.classList.remove('active');
    navOffers.classList.remove('active');
    navAbout.classList.remove('active');
    navHome.classList.remove('active');
    navAnalytics.classList.remove('active');
    navContact.classList.remove('active');
    
    customersCard.style.display = 'block';
    customersStats.style.display = 'grid';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    aboutCard.style.display = 'none';
    homeCard.style.display = 'none';
    analyticsCard.style.display = 'none';
    analyticsStats.style.display = 'none';
    contactInfoCard.style.display = 'none';
    
    headerTitle.innerText = 'Customer Database';
    headerDesc.innerText = 'View users and send promotional offers.';
    openModalBtn.style.display = 'none';
    
    loadCustomers();
};

// Customer Logic
async function loadCustomers() {
    try {
        const { data, error } = await _supabase
            .from('customer_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        allCustomers = data;
        renderCustomers(data);
        totalCustomers.textContent = data.length;
        
        // Simple active today logic (logged in within 24h)
        const activeToday = data.filter(c => {
            const lastLogin = new Date(c.last_login);
            const now = new Date();
            return (now - lastLogin) < (24 * 60 * 60 * 1000);
        }).length;
        activeCustomers.textContent = activeToday;

    } catch (error) {
        console.error('Error loading customers:', error.message);
    }
}

function renderCustomers(customers) {
    customersBody.innerHTML = '';
    customers.forEach(c => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        tr.innerHTML = `
            <td style="padding: 12px;">${c.full_name || 'N/A'}</td>
            <td style="padding: 12px; color: var(--primary-cyan);">${c.email}</td>
            <td style="padding: 12px; color: var(--text-dim); font-size: 0.85rem;">${new Date(c.last_login).toLocaleString()}</td>
            <td style="padding: 12px;">
                <button class="btn-icon" onclick="sendToCustomer('${c.email}')"><i class="fas fa-envelope"></i></button>
            </td>
        `;
        customersBody.appendChild(tr);
    });
}

customerSearch.oninput = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allCustomers.filter(c => 
        c.email.toLowerCase().includes(term) || 
        (c.full_name && c.full_name.toLowerCase().includes(term))
    );
    renderCustomers(filtered);
};

document.getElementById('copyEmailsBtn').onclick = () => {
    const emails = allCustomers.map(c => c.email).join(', ');
    navigator.clipboard.writeText(emails);
    alert('All customer emails copied to clipboard!');
};

// Promotion Logic
document.getElementById('sendPromotionBtn').onclick = () => {
    promotionModal.style.display = 'flex';
};

window.closePromotionModal = () => {
    promotionModal.style.display = 'none';
};

window.sendToCustomer = (email) => {
    window.location.href = `mailto:${email}?subject=Exclusive Offer from CNL Global Soft Tech`;
};

document.getElementById('launchPromoBtn').onclick = () => {
    const subject = encodeURIComponent(document.getElementById('promo_subject').value || 'Special Offer');
    const body = encodeURIComponent(document.getElementById('promo_body').value || '');
    const bcc = allCustomers.map(c => c.email).join(',');
    
    // Using BCC so customers don't see each other's emails
    window.location.href = `mailto:?bcc=${bcc}&subject=${subject}&body=${body}`;
    closePromotionModal();
};

navContact.onclick = (e) => {
    e.preventDefault();
    currentSection = 'contact';
    navContact.classList.add('active');
    navServices.classList.remove('active');
    navOffers.classList.remove('active');
    navAbout.classList.remove('active');
    navHome.classList.remove('active');
    navAnalytics.classList.remove('active');
    
    contactInfoCard.style.display = 'block';
    
    servicesStats.style.display = 'none';
    servicesTableCard.style.display = 'none';
    offersStats.style.display = 'none';
    offersTableCard.style.display = 'none';
    aboutCard.style.display = 'none';
    homeCard.style.display = 'none';
    analyticsCard.style.display = 'none';
    analyticsStats.style.display = 'none';
    
    headerTitle.innerText = 'Contact Info Management';
    headerDesc.innerText = 'Update your company phone numbers, email and social links.';
    openModalBtn.style.display = 'none';
};

// Contact Info Logic
async function loadContact() {
    try {
        const { data, error } = await _supabase
            .from('contact_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;

        if (data) {
            contactPhonePrimary.value = data.phone_primary;
            contactPhoneSecondary.value = data.phone_secondary;
            contactEmail.value = data.email;
            contactLocation.value = data.location;
            contactFacebook.value = data.facebook_url;
            contactInstagram.value = data.instagram_url;
            contactWhatsapp.value = data.whatsapp_url;
        }
    } catch (error) {
        console.error('Error loading contact info:', error.message);
    }
}

if (contactInfoForm) {
    contactInfoForm.onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('saveContactBtn');
        const originalText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

        const updateData = {
            phone_primary: contactPhonePrimary.value,
            phone_secondary: contactPhoneSecondary.value,
            email: contactEmail.value,
            location: contactLocation.value,
            facebook_url: contactFacebook.value,
            instagram_url: contactInstagram.value,
            whatsapp_url: contactWhatsapp.value,
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = await _supabase
                .from('contact_settings')
                .update(updateData)
                .eq('id', 1);

            if (error) throw error;
            alert('Contact information updated successfully!');
        } catch (error) {
            console.error('Error updating contact info:', error.message);
            alert('Error: ' + error.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'SAVE CONTACT INFO';
        }
    };
}

// Social Links Logic
async function loadSocialLinks() {
    try {
        const { data, error } = await _supabase
            .from('social_links')
            .select('*')
            .order('platform_name');

        if (error) throw error;
        allSocialLinks = data;
        renderSocialLinks(data);
    } catch (error) {
        console.error('Error loading social links:', error.message);
    }
}

function renderSocialLinks(links) {
    socialLinksBody.innerHTML = '';
    links.forEach(link => {
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
        tr.innerHTML = `
            <td style="padding: 12px;">${link.platform_name}</td>
            <td style="padding: 12px;"><i class="${link.icon_class}"></i></td>
            <td style="padding: 12px;">
                <div style="display: flex; gap: 10px;">
                    <button class="btn-icon" onclick="editSocial(${link.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteSocial(${link.id})" style="color: var(--accent-red)"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        socialLinksBody.appendChild(tr);
    });
}

window.openSocialModal = () => {
    socialForm.reset();
    document.getElementById('social_id').value = '';
    socialModalTitle.textContent = 'Add Social Media';
    socialModal.style.display = 'flex';
};

window.closeSocialModal = () => {
    socialModal.style.display = 'none';
};

window.editSocial = (id) => {
    const link = allSocialLinks.find(l => l.id === id);
    if (!link) return;
    document.getElementById('social_id').value = link.id;
    document.getElementById('social_platform').value = link.platform_name;
    document.getElementById('social_icon').value = link.icon_class;
    document.getElementById('social_url').value = link.url;
    socialModalTitle.textContent = 'Edit Social Media';
    socialModal.style.display = 'flex';
};

socialForm.onsubmit = async (e) => {
    e.preventDefault();
    saveSocialBtn.disabled = true;
    saveSocialBtn.textContent = 'SAVING...';

    const id = document.getElementById('social_id').value;
    const platform_name = document.getElementById('social_platform').value;
    const icon_class = document.getElementById('social_icon').value;
    const url = document.getElementById('social_url').value;

    try {
        if (id) {
            await _supabase.from('social_links').update({ platform_name, icon_class, url }).eq('id', id);
        } else {
            await _supabase.from('social_links').insert([{ platform_name, icon_class, url }]);
        }
        await loadSocialLinks();
        closeSocialModal();
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        saveSocialBtn.disabled = false;
        saveSocialBtn.textContent = 'SAVE LINK';
    }
};

window.deleteSocial = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    try {
        await _supabase.from('social_links').delete().eq('id', id);
        await loadSocialLinks();
    } catch (error) {
        alert('Error: ' + error.message);
    }
};

// Analytics Content Logic
async function loadAnalytics() {
    try {
        const { data, error } = await _supabase
            .from('site_analytics')
            .select('*')
            .eq('id', 'main_site')
            .single();

        if (error) throw error;

        if (data) {
            totalPageViews.textContent = data.views_count.toLocaleString();
            lastVisitTime.textContent = new Date(data.last_visit).toLocaleString();
        }
    } catch (error) {
        console.error('Error loading analytics:', error.message);
    }
}

// Home Content Logic
async function loadHome() {
    try {
        const { data, error } = await _supabase
            .from('home_content')
            .select('*')
            .eq('id', 1)
            .single();

        if (error) throw error;

        if (data) {
            homeHeroBadge.value = data.hero_badge;
            homeHeroTitle.value = data.hero_title;
            homeHeroDesc.value = data.hero_desc;
            homeHeroSubtext.value = data.hero_subtext;
            homeStat1Num.value = data.stat1_num;
            homeStat1Label.value = data.stat1_label;
            homeStat2Num.value = data.stat2_num;
            homeStat2Label.value = data.stat2_label;
            homeStat3Num.value = data.stat3_num;
            homeStat3Label.value = data.stat3_label;
        }
    } catch (error) {
        console.error('Error loading home content:', error.message);
    }
}

if (homeForm) {
    homeForm.onsubmit = async (e) => {
        e.preventDefault();
        const saveBtn = document.getElementById('saveHomeBtn');
        const originalText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SAVING...';

        const updateData = {
            hero_badge: homeHeroBadge.value,
            hero_title: homeHeroTitle.value,
            hero_desc: homeHeroDesc.value,
            hero_subtext: homeHeroSubtext.value,
            stat1_num: homeStat1Num.value,
            stat1_label: homeStat1Label.value,
            stat2_num: homeStat2Num.value,
            stat2_label: homeStat2Label.value,
            stat3_num: homeStat3Num.value,
            stat3_label: homeStat3Label.value,
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = await _supabase
                .from('home_content')
                .update(updateData)
                .eq('id', 1);

            if (error) throw error;
            alert('Home page content updated successfully!');
        } catch (error) {
            console.error('Error updating home content:', error.message);
            alert('Error: ' + error.message);
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerText = 'SAVE HOME CONTENT';
        }
    };
}
