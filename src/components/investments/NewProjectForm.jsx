import React, { useEffect, useState } from "react";
import modal from "./Modal.module.css";      // whatever modal styling you like
import axiosInstance from "../../utils/axiosInstance";

const NewProjectForm = ({ onSave, onCancel }) => {
    const [form, setForm] = useState({
        title: "",
        category: "",
        equity: '',
        money_needed: '',
        employess_count: '',
        imgFile: null,
        description: "",
        status: "",
        location: "",
        valuation: "",
        founded_year: "",
        target_market: "",
    });
    const [autoCalculate, setAutoCalculate] = useState(true);
    const [preview, setPreview] = useState(null); // data‑url for the img tag
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});

    const numericFields = new Set(['equity', 'money_needed', 'employees_count', 'valuation', 'founded_year']);

    // you watch these two:            ↓↓↓↓↓↓↓↓
    useEffect(() => {
        if (autoCalculate) {
            const needed = Number(form.money_needed) || 0;   // ← correct field
            const percent = Number(form.equity) || 0;

            const val = percent > 0 ? (needed * 100) / percent : 0;
            setForm(prev => ({ ...prev, valuation: Math.round(val) }));
        }
    }, [form.equity, form.money_needed, autoCalculate]);   // ← dependency fixed


    const errorFieldMap = {
        'business_name': 'title',
        'category_id': 'category',
        'percentage_offered': 'equity',
        'money_needed': 'money_needed',
        'employees_count': 'employees_count',
        'description': 'description',
        'status': 'status',
        'location': 'location',
        'valuation': 'valuation', // MAPPING FOR NEW FIELD
        'image': 'imgFile'
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/categories');
                setCategories(response.data);
            } catch (error) {
                setError('Failed to load categories. Please try again.');
                console.error('Failed to fetch categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);
    const pickImage = (e) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (!file) return;

        setForm((f) => ({ ...f, imageFile: file }));

        const url = URL.createObjectURL(file);
        setPreview(url);
    };
    const handle = field => e => {
        const value = e.target.value;
        setForm(f => ({
            ...f,
            [field]: numericFields.has(field) ? Number(value) : value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        // build FormData only if the user picked a file
        const payload = new FormData();
        payload.append('business_name', form.title);
        payload.append('category_id', form.category);
        payload.append('percentage_offered', form.equity);
        payload.append('money_needed', form.money_needed);
        payload.append('employees_count', form.employess_count);
        payload.append('description', form.description);
        payload.append('status', form.status);
        payload.append('location', form.location);
        payload.append('valuation', form.valuation);
        payload.append('founded_year', form.founded_year);
        payload.append('target_market', form.target_market);
        // …other fields…
        if (form.imageFile) {
            payload.append('business_photo', form.imageFile);
        }

        try {
                       const access_token = localStorage.getItem('accessToken');
            if (!access_token) {
                console.error('Access token is missing');
                return;
            }
            await axiosInstance.post('/businesses', payload, {
  headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onSave({ ...form, img: preview });   // keep UI instant
        } catch (err) {
            if (err.response?.data) {
                // Map server errors to form fields
                const mappedErrors = {};
                for (const [serverField, errors] of Object.entries(err.response.data)) {
                    const formField = errorFieldMap[serverField] || serverField;
                    mappedErrors[formField] = errors;
                }
                setFieldErrors(mappedErrors);
            }
        }
    };

    const statuses = [
        { value: '', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'closed', label: 'Closed' },
        { value: 'pending', label: 'Pending' },
    ];

    return (
        <div className={modal.backdrop} role="dialog" aria-modal="true">
            <form className={modal.sheet} onSubmit={submit}>
                <h3>Create new project</h3>

                <label>
                    Title
                    <input value={form.title} onChange={handle("title")} required placeholder="Project title" />
                    {
                        fieldErrors.title && (
                            <div className={modal.errorMessage}>
                                {fieldErrors.title[0]}
                            </div>
                        )
                    }
                </label>
                <label>
                    Category
                    <select
                        value={form.category}
                        onChange={handle("category")}
                        className={modal.dropdown}
                        aria-label="Select Category"
                    >
                        {/* optional placeholder */}
                        <option value="" disabled hidden>
                            Select category…
                        </option>
                        {loading ? (
                            <option>Loading categories...</option>
                        ) : error ? (
                            <option>Error: {error}</option>
                        ) :
                            categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))
                        }
                    </select>
                    {
                        fieldErrors.category && (
                            <div className={modal.errorMessage}>
                                {fieldErrors.category[0]}
                            </div>
                        )
                    }
                </label>

                <label>
                    Status
                    <select
                        value={form.status}
                        onChange={handle("status")}
                        className={modal.dropdown}
                        aria-label="Sort by Status"
                    >
                        {statuses.map((stat) => (
                            <option key={stat.value} value={stat.value}>
                                {stat.label}
                            </option>
                        ))}
                    </select>
                    {
                        fieldErrors.status && (
                            <div className={modal.errorMessage}>
                                {fieldErrors.status[0]}
                            </div>
                        )
                    }
                </label>

                <label>
                    Equity offered (%)
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={form.equity}
                        onChange={handle("equity")}
                    />
                    {fieldErrors.equity && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.equity[0]}
                        </div>
                    )}
                </label>

                <label>
                    Money Needed ($)
                    <input
                        type="number"
                        min="1"
                        value={form.money_needed}
                        onChange={handle("money_needed")}
                    />
                    {fieldErrors.money_needed && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.money_needed[0]}
                        </div>
                    )}
                </label>

                <div className={modal.valuationContainer}>
                    <label className={modal.toggleLabel}>
                        <input
                            type="checkbox"
                            checked={autoCalculate}
                            onChange={() => setAutoCalculate(!autoCalculate)}
                            className={modal.toggleInput}
                        />
                        <span className={modal.toggleSlider}></span>
                        Auto-calculate valuation
                    </label>

                    <label>
                        Valuation ($)
                        <input
                            type="number"
                            min="0"
                            value={form.valuation}
                            onChange={handle("valuation")}
                            disabled={autoCalculate}
                            className={autoCalculate ? modal.autoCalculated : ''}
                        />
                        {fieldErrors.valuation && (
                            <div className={modal.errorMessage}>
                                {fieldErrors.valuation[0]}
                            </div>
                        )}
                    </label>
                </div>

                <label>
                    Employees Count
                    <input
                        type="number"
                        min="1"
                        value={form.employess_count}
                        onChange={handle("employess_count")}
                    />
                    {fieldErrors.employess_count && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.employess_count[0]}
                        </div>
                    )}
                </label>

                <label>
                    Founded Year
                    <input
                        type="number"
                        min="0"
                        value={form.founded_year}
                        onChange={handle("founded_year")}
                    />
                    {fieldErrors.founded_year && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.founded_year[0]}
                        </div>
                    )}
                </label>

                <label>
                    Target Market
                    <input
                        type="text"
                        value={form.target_market}
                        onChange={handle("target_market")}
                    />
                    {fieldErrors.target_market && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.target_market[0]}
                        </div>
                    )}
                </label>

                <label>
                    Location
                    <input
                        type="text"
                        value={form.location}
                        onChange={handle("location")}
                    />
                    {fieldErrors.location && (
                        <div className={modal.errorMessage}>
                            {fieldErrors.location[0]}
                        </div>
                    )}
                </label>

                <label className={modal.uploadLabel}>
                    {preview ? (
                        <img src={preview} alt="Preview" className={modal.preview} />
                    ) : (
                        <span className={modal.uploadText}>Click or drop image here</span>
                    )}

                    {/* hidden native input sits inside <label> so clicking the preview re‑opens file picker */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={pickImage}
                        className={modal.fileInput}
                        name="project_image"
                    />
                </label>


                <label>
                    Short description
                    <textarea
                        rows="3"
                        value={form.description}
                        onChange={handle("description")}
                    />
                    {
                        fieldErrors.description && (
                            <div className={modal.errorMessage}>
                                {fieldErrors.description[0]}
                            </div>
                        )
                    }
                </label>

                <div className={modal.actions}>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit">Save project</button>
                </div>
            </form>
        </div>
    );
};

export default NewProjectForm;
