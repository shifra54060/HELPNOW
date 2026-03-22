const API_BASE = "http://127.0.0.1:8080/api";

document.addEventListener('DOMContentLoaded', () => {
    loadAreas();
    loadRequests(); // טעינה ראשונית
});

async function loadAreas() {
    try {
        const res = await fetch(`${API_BASE}/areas`);
        const response = await res.json();
        const select = document.getElementById('filterArea');
        const areas = response.data || response || [];
        areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.areaCode;
            option.textContent = area.name;
            select.appendChild(option);
        });
    } catch (e) { console.error("Error loading areas", e); }
}

async function loadRequests() {
    const area = document.getElementById('filterArea').value;
    const status = document.getElementById('filterStatus').value;
    const priority = document.getElementById('filterPriority').value;

    // בניית ה-URL עם הפרמטרים
    let params = new URLSearchParams();
    if (area) params.append('location.areaCode', area);
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);

    const url = `${API_BASE}/requests?${params.toString()}`;

    try {
        const res = await fetch(url);
        const response = await res.json();
        let requests = response.data || response || [];

        // מיון סטטי (ממתין -> בטיפול -> הסתיים)
        if (Array.isArray(requests) && requests.length > 0) {
            const statusOrder = { "ממתין": 1, "בטיפול": 2, "הסתיים": 3 };
            requests.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
        }

        renderRequests(requests);
    } catch (e) {
        console.error("Error loading requests", e);
        renderRequests([]);
    }
}

function renderRequests(requests) {
    const container = document.getElementById('requestsList');
    container.innerHTML = ''; // ניקוי המסך

    if (!requests || requests.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; background: white; border-radius: 15px; border: 1px dashed #ccc;">
                <p style="font-size: 1.2rem; color: #666;">לא נמצאו בקשות התואמות לסינון הנבחר.</p>
            </div>`;
        return;
    }

    requests.forEach(req => {
        const priorityMap = { "1": "נמוכה", "2": "בינונית", "3": "גבוהה", "4": "קריטית" };
        const finalPriority = priorityMap[req.priority] || "נמוכה";

        let buttonText = "אני מתנדב";
        let buttonClass = "btn-primary";
        let isDisabled = false;

        if (req.status === 'בטיפול') {
            buttonText = "לסיום (הזן קוד)";
            buttonClass = "btn-info";
        } else if (req.status === 'הסתיים') {
            buttonText = "הסתיים";
            buttonClass = "btn-secondary";
            isDisabled = true;
        }

        container.innerHTML += `
            <div class="card">
                <div style="display: flex; justify-content: space-between;">
                    <span class="badge badge-priority-${finalPriority}">${finalPriority}</span>
                    <small>${req.location?.name || "לא צוין"}</small>
                </div>
                <h3 style="margin: 15px 0 10px 0;">${req.problemDescription || "אין תיאור"}</h3>
                <p>סטטוס: <strong>${req.status}</strong></p>
                <button class="btn ${buttonClass}" 
                        onclick="openVolunteerModal('${req._id}')" 
                        ${isDisabled ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>`;
    });
}

// --- פונקציות המודאל ---

async function openVolunteerModal(id) {
    try {
        const res = await fetch(`${API_BASE}/requests/${id}`);
        const response = await res.json();
        const req = response.data || response;
        const modalBody = document.getElementById('modalBody');
        let authHtml = '';

        if (req.status === 'ממתין' || !req.status) {
            authHtml = `
                <label>מזהה מתנדב קיים:</label>
                <input type="text" id="volunteerIdInput" class="form-control" placeholder="הזן קוד">
                <hr>
                <p style="text-align: center; font-weight: bold;">או רשום מתנדב חדש:</p>
                <input type="text" id="newName" class="form-control" placeholder="שם מלא" style="margin-bottom:5px;">
                <input type="text" id="newPhone" class="form-control" placeholder="טלפון">
                <input type="hidden" id="statusSelect" value="בטיפול">`;
        } else if (req.status === 'בטיפול') {
            authHtml = `
                <div style="background: #e1f5fe; padding: 15px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #b3e5fc;">
                    <p style="margin:0; color: #0277bd;">קריאה זו בטיפול. לסיום, הזן קוד מתנדב:</p>
                </div>
                <input type="text" id="volunteerIdInput" class="form-control" placeholder="הזן קוד מתנדב">
                <input type="hidden" id="statusSelect" value="הסתיים">
                <input type="hidden" id="correctVolunteerCode" value="${req.volunteerCode}">`;
        }

        modalBody.innerHTML = `
            <div style="margin-bottom: 15px;">
                <p><strong>תיאור:</strong> ${req.problemDescription}</p>
                <p><strong>מיקום:</strong> ${req.location?.name || 'לא צוין'}</p>
                <p><strong>טלפון:</strong> ${req.contactPhone || 'לא זמין'}</p>
            </div>
            <div id="authSection">${authHtml}</div>`;

        document.getElementById('modalFooter').innerHTML =
            `<button class="btn btn-success" onclick="processVolunteer('${id}')">אישור וביצוע</button>`;
        document.getElementById('volunteerModal').style.display = 'block';
    } catch (e) { alert("שגיאה בטעינת נתונים"); }
}

async function processVolunteer(requestId) {
    const existingId = document.getElementById('volunteerIdInput').value;
    const newName = document.getElementById('newName')?.value;
    const newPhone = document.getElementById('newPhone')?.value;
    const selectedStatus = document.getElementById('statusSelect').value;
    const correctCode = document.getElementById('correctVolunteerCode')?.value;

    if (selectedStatus === 'הסתיים' && correctCode && existingId !== correctCode) {
        alert("שגיאה: רק המתנדב שמשויך לקריאה יכול לסיים אותה!");
        return;
    }

    let finalVolunteerId = existingId;
    if (!existingId && newName && newPhone) {
        try {
            const res = await fetch(`${API_BASE}/volunteers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, phone: newPhone })
            });
            const result = await res.json();
            if (res.ok) {
                finalVolunteerId = result.data?._id || result._id;
                alert(`נרשמת בהצלחה! קוד: ${finalVolunteerId}`);
            }
        } catch (e) { return alert("שגיאה ברישום"); }
    }

    if (!finalVolunteerId) return alert("חובה להזין קוד מתנדב");

    try {
        const res = await fetch(`${API_BASE}/requests/${requestId}/assign`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: selectedStatus, volunteerCode: finalVolunteerId })
        });
        if (res.ok) {
            alert("הבקשה עודכנה בהצלחה!");
            location.reload();
        } else {
            const err = await res.json();
            alert("שגיאה: " + (err.message || "פעולה נכשלה."));
        }
    } catch (e) { alert("שגיאה בתקשורת"); }
}

function closeModal() { document.getElementById('volunteerModal').style.display = 'none'; }