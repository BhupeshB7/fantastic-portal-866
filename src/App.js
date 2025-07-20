
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, ChevronDown, CheckCircle2, XCircle, Circle, Play, Upload, Code, FileText, ArrowLeft, Loader2, Info } from 'lucide-react';

const mockProblems = [
    {
        id: 1,
        title: "Two Sum",
        difficulty: "Easy",
        status: "Solved",
        description: `
            <p class="mb-4">Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
            <p class="mb-4">You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the <em>same</em> element twice.</p>
            <p>You can return the answer in any order.</p>
        `,
        starterCode: `function twoSum(nums, target) {\n  // Write your code here\n}`,
        testCases: [
            { input: { nums: [2, 7, 11, 15], target: 9 }, expected: "[0,1]" },
            { input: { nums: [3, 2, 4], target: 6 }, expected: "[1,2]" },
            { input: { nums: [3, 3], target: 6 }, expected: "[0,1]" },
        ],
        solution: (nums, target) => {
            const map = new Map();
            for (let i = 0; i < nums.length; i++) {
                const complement = target - nums[i];
                if (map.has(complement)) {
                    return JSON.stringify([map.get(complement), i].sort((a,b)=>a-b));
                }
                map.set(nums[i], i);
            }
        }
    },
    {
        id: 2,
        title: "Add Two Numbers",
        difficulty: "Medium",
        status: "Attempted",
        description: `
            <p class="mb-4">You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.</p>
            <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>
        `,
        starterCode: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction addTwoNumbers(l1, l2) {\n  // Write your code here\n}`,
        testCases: [
            { input: { l1: '[2,4,3]', l2: '[5,6,4]' }, expected: "[7,0,8]" },
            { input: { l1: '[0]', l2: '[0]' }, expected: "[0]" },
        ],
        solution: () => "[7,0,8]", // Simplified for demo
    },
    {
        id: 3,
        title: "Median of Two Sorted Arrays",
        difficulty: "Hard",
        status: "Todo",
        description: `
            <p class="mb-4">Given two sorted arrays <code>nums1</code> and <code>nums2</code> of size <code>m</code> and <code>n</code> respectively, return <strong>the median</strong> of the two sorted arrays.</p>
            <p>The overall run time complexity should be <code>O(log (m+n))</code>.</p>
        `,
        starterCode: `function findMedianSortedArrays(nums1, nums2) {\n  // Write your code here\n}`,
        testCases: [
            { input: { nums1: '[1,3]', nums2: '[2]' }, expected: "2.00000" },
            { input: { nums1: '[1,2]', nums2: '[3,4]' }, expected: "2.50000" },
        ],
        solution: () => "2.00000", // Simplified for demo
    },
    {
        id: 4,
        title: "Valid Parentheses",
        difficulty: "Easy",
        status: "Todo",
        description: `
            <p class="mb-4">Given a string <code>s</code> containing just the characters <code>'('</code>, <code>')'</code>, <code>'{'</code>, <code>'}'</code>, <code>'['</code> and <code>']'</code>, determine if the input string is valid.</p>
            <p>An input string is valid if:</p>
            <ol class="list-decimal list-inside ml-4">
                <li>Open brackets must be closed by the same type of brackets.</li>
                <li>Open brackets must be closed in the correct order.</li>
                <li>Every close bracket has a corresponding open bracket of the same type.</li>
            </ol>
        `,
        starterCode: `function isValid(s) {\n  // Write your code here\n}`,
        testCases: [
            { input: { s: '"()"' }, expected: "true" },
            { input: { s: '"()[]{}"' }, expected: "true" },
            { input: { s: '"(]"' }, expected: "false" },
        ],
        solution: () => "true", // Simplified for demo
    },
];

const DifficultyBadge = ({ difficulty }) => {
    const colors = {
        Easy: "bg-emerald-900 text-emerald-300",
        Medium: "bg-yellow-800 text-yellow-300",
        Hard: "bg-rose-800 text-rose-300",
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[difficulty]}`}>{difficulty}</span>;
};

const StatusIcon = ({ status }) => {
    switch (status) {
        case 'Solved':
            return <CheckCircle2 className="text-emerald-500" size={20} aria-label="Solved" />;
        case 'Attempted':
            return <Info className="text-sky-500" size={20} aria-label="Attempted" />;
        case 'Todo':
            return <Circle className="text-slate-500" size={20} aria-label="To do" />;
        default:
            return null;
    }
};

const LeetCodePlatformUI = () => {
    const [problems] = useState(mockProblems);
    const [selectedProblem, setSelectedProblem] = useState(mockProblems[0]);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [userCode, setUserCode] = useState(selectedProblem.starterCode);
    const [activeTab, setActiveTab] = useState('description');
    const [consoleOutput, setConsoleOutput] = useState({ type: 'info', message: 'Run code to see output here.' });
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [view, setView] = useState('list'); // 'list' or 'detail' for mobile

    useEffect(() => {
        if (selectedProblem) {
            setUserCode(selectedProblem.starterCode);
            setConsoleOutput({ type: 'info', message: 'Run code to see output here.' });
            setActiveTab('description');
        }
    }, [selectedProblem]);
    
    const handleProblemSelect = (problem) => {
        setSelectedProblem(problem);
        if (window.innerWidth < 1024) {
            setView('detail');
        }
    };

    const filteredProblems = useMemo(() => {
        return problems
            .filter(p => difficultyFilter === 'All' || p.difficulty === difficultyFilter)
            .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [problems, difficultyFilter, searchTerm]);

    const handleRunCode = useCallback(() => {
        if (!selectedProblem) return;
        setIsRunning(true);
        setTimeout(() => {
            const isCorrect = Math.random() > 0.3; // Simulate success/fail
            if (isCorrect) {
                const solution = selectedProblem.solution(selectedProblem.testCases[0].input.nums, selectedProblem.testCases[0].input.target);
                setConsoleOutput({
                    type: 'success',
                    message: `Test Case 1 Passed!\nInput: nums = ${JSON.stringify(selectedProblem.testCases[0].input.nums)}, target = ${selectedProblem.testCases[0].input.target}\nOutput: ${solution}\nExpected: ${selectedProblem.testCases[0].expected}`
                });
            } else {
                setConsoleOutput({
                    type: 'error',
                    message: 'Test Case 1 Failed: Wrong Answer\nInput: nums = [3,2,4], target = 6\nOutput: [0,2]\nExpected: [1,2]'
                });
            }
            setIsRunning(false);
        }, 1500);
    }, [selectedProblem]);

    const handleSubmitCode = useCallback(() => {
        if (!selectedProblem) return;
        setIsSubmitting(true);
        setTimeout(() => {
            const isCorrect = Math.random() > 0.5;
            if (isCorrect) {
                setConsoleOutput({ type: 'success', message: 'Accepted! All test cases passed.' });
            } else {
                setConsoleOutput({ type: 'error', message: 'Rejected: One or more test cases failed.' });
            }
            setIsSubmitting(false);
        }, 2500);
    }, [selectedProblem]);


    const ConsoleMessage = ({ output }) => {
        const colors = {
            info: 'text-slate-400',
            success: 'text-emerald-400',
            error: 'text-rose-400',
        };
        const Icon = {
            info: Info,
            success: CheckCircle2,
            error: XCircle,
        }[output.type];

        return (
            <div className={`p-4 rounded-lg bg-slate-900/50 ${colors[output.type]}`}>
                <div className="flex items-start">
                    <Icon className="mr-3 mt-1 flex-shrink-0" size={20} />
                    <pre className="font-mono text-sm whitespace-pre-wrap">{output.message}</pre>
                </div>
            </div>
        );
    };

    const ProblemList = () => (
        <div className="flex flex-col bg-slate-900 h-full">
            <div className="p-4 border-b border-slate-800">
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search problems..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                    />
                </div>
                <div className="flex space-x-2">
                    {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                        <button
                            key={diff}
                            onClick={() => setDifficultyFilter(diff)}
                            className={`px-3 py-1 text-sm rounded-full transition-colors ${difficultyFilter === diff ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                            {diff}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-grow overflow-y-auto">
                <ul>
                    {filteredProblems.map(p => (
                        <li
                            key={p.id}
                            onClick={() => handleProblemSelect(p)}
                            className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${selectedProblem?.id === p.id ? 'bg-indigo-900/50' : 'hover:bg-slate-800/50'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <StatusIcon status={p.status} />
                                <span className={`text-sm ${selectedProblem?.id === p.id ? 'text-white' : 'text-slate-300'}`}>{p.title}</span>
                            </div>
                            <DifficultyBadge difficulty={p.difficulty} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );

    const ProblemDetail = () => (
        <div className="flex flex-col h-full bg-slate-950 text-slate-300">
            {view === 'detail' && window.innerWidth < 1024 && (
                <div className="p-2 border-b border-slate-800">
                    <button onClick={() => setView('list')} className="flex items-center text-sm text-slate-400 hover:text-white transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Problems
                    </button>
                </div>
            )}
            <div className="p-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-white mb-2">{selectedProblem?.title}</h1>
                <div className="flex items-center space-x-4">
                    <DifficultyBadge difficulty={selectedProblem?.difficulty} />
                    <div className="flex items-center space-x-2 text-sm">
                        <StatusIcon status={selectedProblem?.status} />
                        <span>{selectedProblem?.status}</span>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col flex-grow overflow-y-auto">
                <div className="flex-shrink-0 border-b border-slate-800">
                    <div className="flex px-4">
                        {['description', 'testcases'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex items-center space-x-2 py-3 px-4 text-sm font-medium transition-all duration-200 border-b-2 ${activeTab === tab ? 'text-white border-indigo-500' : 'text-slate-400 border-transparent hover:text-white hover:border-slate-500'}`}
                            >
                                {tab === 'description' ? <FileText size={16} /> : <Code size={16} />}
                                <span className="capitalize">{tab}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-6 flex-grow overflow-y-auto text-slate-300 prose prose-invert prose-sm max-w-none prose-code:text-sky-300 prose-code:bg-slate-800 prose-code:p-1 prose-code:rounded-md prose-code:font-mono">
                    {activeTab === 'description' && (
                        <div dangerouslySetInnerHTML={{ __html: selectedProblem.description }} />
                    )}
                    {activeTab === 'testcases' && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Test Cases</h3>
                            {selectedProblem.testCases.map((tc, index) => (
                                <div key={index} className="mb-4 p-4 bg-slate-900 rounded-lg">
                                    <p className="font-mono text-sm"><strong>Input:</strong> {JSON.stringify(tc.input)}</p>
                                    <p className="font-mono text-sm"><strong>Expected:</strong> {tc.expected}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-shrink-0 p-4 border-t border-slate-800">
                 <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="w-full h-48 p-4 bg-slate-900 border border-slate-700 rounded-lg font-mono text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none transition-colors"
                    placeholder="Write your code here..."
                    aria-label="Code Editor"
                />
            </div>
            
            <div className="flex-shrink-0 p-4 border-t border-slate-800">
                <h3 className="text-lg font-semibold text-white mb-3">Console</h3>
                <ConsoleMessage output={consoleOutput} />
            </div>

            <div className="flex-shrink-0 flex items-center justify-end p-4 space-x-4 border-t border-slate-800 bg-slate-900/50">
                <button 
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center justify-center px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRunning ? <Loader2 className="animate-spin mr-2" size={18} /> : <Play size={18} className="mr-2" />}
                    Run
                </button>
                <button 
                    onClick={handleSubmitCode}
                    disabled={isRunning || isSubmitting}
                    className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Upload size={18} className="mr-2" />}
                    Submit
                </button>
            </div>
        </div>
    );
    
    return (
        <div className="h-screen w-full bg-slate-950 font-sans">
            <main className="flex h-full">
                <div className={`w-full lg:w-1/3 lg:flex-shrink-0 border-r border-slate-800 h-full ${view === 'detail' && 'hidden'} lg:block`}>
                    <ProblemList />
                </div>
                <div className={`w-full lg:w-2/3 h-full ${view === 'list' && 'hidden'} lg:block`}>
                    {selectedProblem ? (
                        <ProblemDetail />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500">
                            Select a problem to start
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LeetCodePlatformUI;
