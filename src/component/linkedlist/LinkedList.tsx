import React, { useState } from 'react';

const LinkedList: React.FC = () => {
    const [nodes, setNodes] = useState<string[]>([]); // State for storing nodes
    const [inputValue, setInputValue] = useState<string>(''); // Input field value

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleGenerateNodes = () => {
        // Splits input by space, trims whitespace, and filters out empty values
        const items = inputValue.trim().split(/\s+/).filter(Boolean);
        setNodes(items); // Set nodes in state
        setInputValue(''); // Clear input
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-center text-2xl p-2">Singly Linked List Visualization</h1>
            <div className="p-2 flex items-center flex-col w-full">
                <p className="mb-2">List of Nodes</p>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter items separated by space"
                    className="text-center h-10 border-2 border-gray-600 rounded-md w-full max-w-lg p-2 mb-4"
                />
                <button
                    onClick={handleGenerateNodes}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Generate Nodes
                </button>
            </div>

            <div className="flex items-center mt-6 relative">
                {nodes.map((node, index) => (
                    <div key={index} className="flex items-center">
                        <div className="bg-blue-200 text-center py-2 px-4 min-w-[64px] rounded-lg shadow-md font-semibold text-blue-800">
                            {node}
                        </div>
                        {index < nodes.length - 1 && (
                            <svg
                                width="40"
                                height="20"
                                viewBox="0 0 40 20"
                                className="mx-2"
                            >
                                <path d="M0 10h30M30 5l5 5-5 5" stroke="gray" strokeWidth="2" fill="none" />
                            </svg>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LinkedList;
