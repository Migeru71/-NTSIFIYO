import React from 'react';

const RegisterForm = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-text-main">Create Visitor Account</h2>
                <p className="text-text-muted">Teachers and Students are registered by administration.</p>
            </div>

            <form className="flex flex-col gap-4">
                <input className="w-full p-3 rounded-lg border border-[#cfe7cf]" placeholder="Full Name" type="text" />
                <input className="w-full p-3 rounded-lg border border-[#cfe7cf]" placeholder="Email Address" type="email" />
                <input className="w-full p-3 rounded-lg border border-[#cfe7cf]" placeholder="Create Password" type="password" />

                <button className="w-full py-3.5 bg-primary text-white font-bold rounded-lg">
                    Register as Guest
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;