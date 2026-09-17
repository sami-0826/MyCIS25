/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CourseDefinition {
  code: string;
  fullName: string;
  shortName: string;
  type: 'Theory' | 'Lab' | 'Theory & Lab';
  creditHours?: string;
  description: string;
  topics: string[];
  instructors: string[]; // Teacher initials
}

export const COURSE_DEFINITIONS: Record<string, CourseDefinition> = {
  'CAO': {
    code: 'CAO',
    fullName: 'Computer Architecture & Organization',
    shortName: 'CAO',
    type: 'Theory',
    creditHours: '3.0 Credits',
    description: 'Structure and operational behavior of computing systems, CPU instruction sets, ALU design, memory hierarchy, cache organization, bus architecture, and input/output interfaces.',
    topics: ['Von Neumann Architecture', 'Instruction Set Architecture (ISA)', 'Memory Hierarchy & Cache', 'Pipelining & ALU', 'Buses & System Interconnects'],
    instructors: ['DMSU', 'RHN', 'MSH'],
  },
  'DS': {
    code: 'DS',
    fullName: 'Data Structures (Theory)',
    shortName: 'Data Structures',
    type: 'Theory',
    creditHours: '3.0 Credits',
    description: 'Fundamental data representations and algorithm analysis: Arrays, Singly & Doubly Linked Lists, Stacks, Queues, Binary Trees, Binary Search Trees, Graphs, Sorting and Searching efficiency.',
    topics: ['Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Trees & BSTs', 'Graph Algorithms', 'Time Complexity (Big-O)'],
    instructors: ['MH', 'IS'],
  },
  'DS Lab': {
    code: 'DS Lab',
    fullName: 'Data Structures Laboratory',
    shortName: 'DS Lab',
    type: 'Lab',
    creditHours: '1.5 Credits',
    description: 'Hands-on programming and practical implementation of data structures and algorithms using C/C++. Writing clean code for linear and non-linear data manipulation.',
    topics: ['C/C++ Pointer Mechanics', 'Dynamic Memory Allocation', 'Linked List Implementation', 'Stack & Queue Applications', 'Tree Traversal Coding'],
    instructors: ['MH', 'IS'],
  },
  'Math I': {
    code: 'Math I',
    fullName: 'Mathematics I (Calculus & Geometry)',
    shortName: 'Mathematics I',
    type: 'Theory',
    creditHours: '3.0 Credits',
    description: 'Differential and integral calculus essential for computer science: limits, continuity, derivative techniques, integration theorems, and coordinate geometry analysis.',
    topics: ['Differential Calculus', 'Integral Calculus', 'Limits & Continuity', 'Coordinate Geometry', 'Practical Applications in Computing'],
    instructors: ['MMDH'],
  },
  'English II': {
    code: 'English II',
    fullName: 'English Language II',
    shortName: 'English II',
    type: 'Theory',
    creditHours: '3.0 Credits',
    description: 'Advanced technical writing, professional business communication, spoken presentations, academic essay composition, and conversational English fluency.',
    topics: ['Technical Report Writing', 'Presentation Skills', 'Reading Comprehension', 'Grammar & Syntax Mastery', 'Professional Correspondence'],
    instructors: ['TA'],
  },
};

export const getCourseInfo = (code: string): CourseDefinition => {
  const normalized = code.trim();
  if (COURSE_DEFINITIONS[normalized]) {
    return COURSE_DEFINITIONS[normalized];
  }
  // Try matching substring
  if (normalized.includes('DS') && (normalized.includes('Lab') || normalized.toLowerCase().includes('lab'))) {
    return COURSE_DEFINITIONS['DS Lab'];
  }
  if (normalized.includes('DS')) return COURSE_DEFINITIONS['DS'];
  if (normalized.includes('CAO')) return COURSE_DEFINITIONS['CAO'];
  if (normalized.includes('Math')) return COURSE_DEFINITIONS['Math I'];
  if (normalized.includes('Eng')) return COURSE_DEFINITIONS['English II'];

  return {
    code: normalized,
    fullName: normalized,
    shortName: normalized,
    type: 'Theory',
    description: 'Batch 25 Academic Course',
    topics: [],
    instructors: [],
  };
};
