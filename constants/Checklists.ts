export type GradeLevel = '9th' | '10th' | '11th' | '12th' | 'Graduated';

export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type ChecklistData = {
  [key in GradeLevel]: {
    [key:string]: Task[]; // key is month name
  };
};

export const checklists: ChecklistData = {
  '9th': {
    'August': [
      { id: '1', text: 'Schedule a planning session with ICAN', done: false },
      { id: '2', text: 'Attend Freshman Transition event', done: false },
      { id: '3', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '4', text: 'Use a planner', done: false },
      { id: '5', text: 'Talk to adults about their careers!!', done: false },
    ],
    'September': [
      { id: '1', text: 'Join extracurriculars and track them with an activities resume', done: false },
      { id: '2', text: 'Attend the Golden Circle College & Career Fair', done: false },
      { id: '3', text: 'Explore career assessments', done: false },
    ],
    'October': [
      { id: '1', text: 'Explore education and training options (CollegeRaptor, CTE programs, apprenticeships)', done: false },
      { id: '2', text: 'Research career pathways', done: false },
    ],
    'November': [
      { id: '1', text: 'Talk with parents about future plans', done: false },
      { id: '2', text: 'Meet with counselor about course selection', done: false },
      { id: '3', text: 'Read regularly', done: false },
      { id: '4', text: 'Volunteer', done: false },
    ],
    'December': [
      { id: '1', text: 'Learn computer applications (Word, Excel, etc.)', done: false },
      { id: '2', text: 'Research 3 careers and related training programs', done: false },
      { id: '3', text: 'Learn about financial aid options', done: false },
    ],
    'January': [
      { id: '1', text: 'Explore skill-building at ICAN\'s career planning site', done: false },
      { id: '2', text: 'Talk to parents about a college savings plan', done: false },
    ],
    'February': [
      { id: '1', text: 'Research high-growth jobs and their required training', done: false },
      { id: '2', text: 'Choose 10th-grade classes with counselor', done: false },
      { id: '3', text: 'Identify job shadow options', done: false },
    ],
    'March': [
      { id: '1', text: 'Find summer camps in your area of interest', done: false },
      { id: '2', text: 'Keep GPA strong', done: false },
      { id: '3', text: 'Attend the Future Ready Career & College Fair', done: false },
    ],
    'April': [
      { id: '1', text: 'Talk to seniors about their planning process', done: false },
      { id: '2', text: 'Visit a college campus or take a virtual tour', done: false },
      { id: '3', text: 'Build relationships for future recommendations', done: false },
    ],
    'May': [
      { id: '1', text: 'Job shadow, volunteer, or intern', done: false },
      { id: '2', text: 'Start a summer reading list', done: false },
      { id: '3', text: 'Learn about athletic requirements if you want to play sports', done: false },
    ],
    'June': [
      { id: '1', text: 'Attend a summer camp on a college campus (if applicable)', done: false },
      { id: '2', text: 'Create an activities resume', done: false },
      { id: '3', text: 'Talk to adults about their career choices', done: false },
    ],
    'July': [
      { id: '1', text: 'Review career assessment and explore matching colleges', done: false },
      { id: '2', text: 'Join hobbies tied to career interests', done: false },
      { id: '3', text: 'Stay open to changing goals', done: false },
    ],
  },
  '10th': {
    'August': [
      { id: '1', text: 'Visit ICAN Center for career/college planning', done: false },
      { id: '2', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '3', text: 'Find a mentor', done: false },
      { id: '4', text: 'Attend career planning events', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend Golden Circle Fair', done: false },
      { id: '2', text: 'Register for PreACT or PSAT/NMSQT', done: false },
      { id: '3', text: 'Sign up for job shadows', done: false },
      { id: '4', text: 'Join school/community activities', done: false },
    ],
    'October': [
      { id: '1', text: 'Compare careers and research job characteristics', done: false },
      { id: '2', text: 'Attend a college fair', done: false },
      { id: '3', text: 'Take/update career assessment', done: false },
    ],
    'November': [
      { id: '1', text: 'Discuss admission requirements with counselor', done: false },
      { id: '2', text: 'Explore tuition and financial aid options', done: false },
      { id: '3', text: 'Talk to adults about their careers', done: false },
    ],
    'December': [
      { id: '1', text: 'Meet college reps/career speakers', done: false },
      { id: '2', text: 'Schedule advising with ICAN', done: false },
      { id: '3', text: 'Learn about alternate education options', done: false },
      { id: '4', text: 'Volunteer over winter break', done: false },
    ],
    'January': [
      { id: '1', text: 'Keep track of extracurriculars in your activities resume', done: false },
      { id: '2', text: 'Review types of financial aid', done: false },
      { id: '3', text: 'Review financial plan for post-high school', done: false },
    ],
    'February': [
      { id: '1', text: 'Attend ICAN planning nights', done: false },
      { id: '2', text: 'Confirm junior year classes align with your career path', done: false },
      { id: '3', text: 'Explore career pathways using MyACT', done: false },
    ],
    'March': [
      { id: '1', text: 'Consider AP classes', done: false },
      { id: '2', text: 'Attend ICAN Future Ready Fair', done: false },
      { id: '3', text: 'Talk to professionals in your field of interest', done: false },
      { id: '4', text: 'Tour colleges if on vacation', done: false },
    ],
    'April': [
      { id: '1', text: 'Review college financial plan', done: false },
      { id: '2', text: 'Explore scholarships and savings strategies', done: false },
      { id: '3', text: 'Gain experience via job shadowing or internships', done: false },
      { id: '4', text: 'Use ROCI Tool to compare career ROI', done: false },
    ],
    'May': [
      { id: '1', text: 'Check status of savings plans', done: false },
      { id: '2', text: 'Ask counselor about summer programs', done: false },
      { id: '3', text: 'Look for summer jobs related to your interests', done: false },
    ],
    'June': [
      { id: '1', text: 'Keep reading over the summer', done: false },
      { id: '2', text: 'Join hobbies that develop career interests', done: false },
      { id: '3', text: 'Learn about athletic eligibility', done: false },
    ],
    'July': [
      { id: '1', text: 'Tour college campuses during camp visits', done: false },
      { id: '2', text: 'Talk to parents about cost planning', done: false },
      { id: '3', text: 'Maintain connections for future recommendations', done: false },
    ],
  },
  '11th': {
    'August': [
      { id: '1', text: 'Sign up for ICAN Tip of the Week', done: false },
      { id: '2', text: 'Learn about college fairs/events!!', done: false },
      { id: '3', text: 'Keep GPA up', done: false },
      { id: '4', text: 'Review/start a savings plan', done: false },
      { id: '5', text: 'Take a career assessment', done: false },
      { id: '6', text: 'Talk to parents about careers', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend the Golden Circle College & Career Fair', done: false },
      { id: '2', text: 'Register for the PSAT/NMSQT', done: false },
      { id: '3', text: 'Explore military and apprenticeship options', done: false },
      { id: '4', text: 'Schedule ICAN planning session', done: false },
    ],
    'October': [
      { id: '1', text: 'Attend college/career fairs', done: false },
      { id: '2', text: 'Explore Iowa colleges', done: false },
      { id: '3', text: 'Talk with your counselor about admission readiness', done: false },
    ],
    'November': [
      { id: '1', text: 'Review college brochures', done: false },
      { id: '2', text: 'Make a list of 10–15 colleges', done: false },
      { id: '3', text: 'Download the College Checklist', done: false },
      { id: '4', text: 'Start SAT/ACT planning', done: false },
      { id: '5', text: 'Research scholarships', done: false },
    ],
    'December': [
      { id: '1', text: 'Register for January SAT or February ACT', done: false },
      { id: '2', text: 'Meet with college reps/career speakers', done: false },
      { id: '3', text: 'Use CollegeRaptor.com to compare colleges', done: false },
      { id: '4', text: 'Schedule planning with ICAN', done: false },
    ],
    'January': [
      { id: '1', text: 'Register for March SAT', done: false },
      { id: '2', text: 'Attend a financial aid seminar', done: false },
      { id: '3', text: 'Plan campus visits based on \'No School\' days', done: false },
    ],
    'February': [
      { id: '1', text: 'Create an education/training budget (use ROCI tool)', done: false },
      { id: '2', text: 'Choose senior classes aligned with your career path', done: false },
      { id: '3', text: 'Register for April ACT', done: false },
      { id: '4', text: 'Talk about AP/CLEP/honors courses', done: false },
    ],
    'March': [
      { id: '1', text: 'Attend the ICAN Future Ready Fair', done: false },
      { id: '2', text: 'Visit college campuses', done: false },
      { id: '3', text: 'Ask for letters of recommendation', done: false },
      { id: '4', text: 'Use Scholarship Finder', done: false },
    ],
    'April': [
      { id: '1', text: 'Register for May SAT', done: false },
      { id: '2', text: 'Explore majors/careers', done: false },
      { id: '3', text: 'Use CollegeRaptor.com', done: false },
      { id: '4', text: 'Review college savings', done: false },
    ],
    'May': [
      { id: '1', text: 'Register for June ACT/SAT', done: false },
      { id: '2', text: 'Narrow college list', done: false },
      { id: '3', text: 'Plan a productive summer', done: false },
    ],
    'June': [
      { id: '1', text: 'Review college list', done: false },
      { id: '2', text: 'Begin college essays', done: false },
      { id: '3', text: 'Update activities resume', done: false },
    ],
    'July': [
      { id: '1', text: 'Register for September ACT', done: false },
      { id: '2', text: 'Visit college campuses', done: false },
      { id: '3', text: 'Use Scholarship Finder', done: false },
    ],
  },
  '12th': {
    'August': [
      { id: '1', text: 'Create a calendar for admission tasks', done: false },
      { id: '2', text: 'Register for ACT/SAT if needed', done: false },
      { id: '3', text: 'Review and narrow your college list', done: false },
      { id: '4', text: 'Prepare for college applications', done: false },
      { id: '5', text: 'Work on your activity resume', done: false },
    ],
    'September': [
      { id: '1', text: 'Attend the Golden Circle College Fair', done: false },
      { id: '2', text: 'Finalize college essays', done: false },
      { id: '3', text: 'Request letters of recommendation', done: false },
      { id: '4', text: 'Send transcripts to colleges', done: false },
      { id: '5', text: 'Register for your FSA ID', done: false },
    ],
    'October': [
      { id: '1', text: 'Complete the FAFSA', done: false },
      { id: '2', text: 'Submit college applications', done: false },
      { id: '3', text: 'Request transcripts be sent', done: false },
      { id: '4', text: 'Send ACT/SAT scores', done: false },
    ],
    'November': [
      { id: '1', text: 'Continue applying for scholarships', done: false },
      { id: '2', text: 'Verify application submission', done: false },
    ],
    'December': [
      { id: '1', text: 'Apply for scholarships', done: false },
      { id: '2', text: 'Review financial aid offers', done: false },
      { id: '3', text: 'Update your profile for admissions portals', done: false },
    ],
    'January': [
      { id: '1', text: 'Complete any remaining applications', done: false },
      { id: '2', text: 'Review Student Aid Reports (SAR)', done: false },
      { id: '3', text: 'Send mid-year grade reports', done: false },
    ],
    'February': [
      { id: '1', text: 'Compare financial aid packages', done: false },
      { id: '2', text: 'Continue scholarship search', done: false },
      { id: '3', text: 'Verify FAFSA if selected', done: false },
    ],
    'March': [
      { id: '1', text: 'Visit your top-choice colleges again', done: false },
      { id: '2', text: 'Make your final college decision', done: false },
    ],
    'April': [
      { id: '1', text: 'Notify colleges of your decision by May 1', done: false },
      { id: '2', text: 'Submit your deposit', done: false },
      { id: '3', text: 'Decline other admission offers', done: false },
    ],
    'May': [
      { id: '1', text: 'Take AP exams', done: false },
      { id: '2', text: 'Request final transcripts be sent to your chosen college', done: false },
    ],
    'June': [
      { id: '1', text: 'Attend orientation', done: false },
      { id: '2', text: 'Register for classes', done: false },
      { id: '3', text: 'Thank your recommenders', done: false },
    ],
    'July': [
      { id: '1', text: 'Plan for move-in day', done: false },
      { id: '2', text: 'Review your budget', done: false },
      { id: '3', 'text': 'Get ready for college!', done: false },
    ],
  },
  'Graduated': {
    'August': [],
    'September': [],
    'October': [],
    'November': [],
    'December': [],
    'January': [],
    'February': [],
    'March': [],
    'April': [],
    'May': [],
    'June': [],
    'July': [],
  }
}; 