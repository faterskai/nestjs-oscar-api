module.exports = {
  generateRandomData: function(userContext, events, done) {
    const titles = [
      'Stress Test Movie', 
      'Epic Load', 
      'Data Overload', 
      'System Smash'
    ];
    const descriptions = [
      'A movie created under extreme load.',
      'Testing the limits of performance.',
      'An experiment in system resilience.',
      'Simulating diverse scenarios.'
    ];
    const directors = [
      'Load Tester', 
      'Stress Manager', 
      'Performance Guru', 
      'Tester Supreme'
    ];
    
    userContext.vars.title = titles[Math.floor(Math.random() * titles.length)];
    userContext.vars.description = descriptions[Math.floor(Math.random() * descriptions.length)];
    userContext.vars.director = directors[Math.floor(Math.random() * directors.length)];
    userContext.vars.release = 2020 + Math.floor(Math.random() * 6);
    userContext.vars.winner = Math.random() < 0.5;
    
    return done();
  }
};
