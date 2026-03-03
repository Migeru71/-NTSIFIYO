import React from 'react';
import DictionaryBrowser from '../components/Dictionary/DictionaryBrowser';

const DictionaryPage = () => {
    return (
        <div className="w-full flex-1 relative">
            <div className="w-full">
                <div className="max-w-6xl mx-auto p-4 sm:p-8">
                    <DictionaryBrowser isAdmin={false} />
                </div>
            </div>
        </div>
    );
};

export default DictionaryPage;
