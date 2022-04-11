const btn = document.querySelector('#playAllGroupPhaseGame')
        
btn.addEventListener('click', ()=>{
      btn.disabled = true;
      document.querySelector('section').style.display='block';
      main();
  }); 

const main = () => {
    // ****************************************************************************
    // Prikupljanja podataka iz JSON fajla
    fetch("./teams.json")
      .then((res) => {
        return res.json();
      })
  
      // **************************************************************************
      // Igranje virtualnih utakmica svako sa svakim
      // Vracanja rezultate po grupama
      .then((resJson) => {
  
        display(resJson)
        play(resJson)

        return resJson
      })
  
      // *************************************************************************
      //Vraca 8 grupa sa prva dva tima u odnosu koliko poena imaju 
      .then((response) => {
        var firstTwo = [];
        response.forEach(element => {
          firstTwo.push(element.splice(0, 2));
        })
        return firstTwo;
      })
  
      // *************************************************************************
      // Igranje eliminacionih faza Osmina finala
      .then((eighthsFinal) => {
        const osminaFinalaTabela = document.querySelector('.eighthsFinalsTabela');
        const osminaFinalaUtakmice = document.querySelector('.eighthsFinals');

        var winers = [];

        winers = proba(eighthsFinal, osminaFinalaUtakmice, osminaFinalaTabela);
         
        return winers;
      })
  
      // *************************************************************************
      // Igranje eliminacionih faza Cetvrtina finala
      .then((quarterFinals) => {
        const cetvrtinaFinalaTabela = document.querySelector('.quarterFinalsTabela');
        const cetvrtinaFinalaUtakmice = document.querySelector('.quarterFinals');

        var winers = [];

        winers = proba(quarterFinals, cetvrtinaFinalaUtakmice, cetvrtinaFinalaTabela);
         
        return winers;
      })
  
      // *************************************************************************
      // Igranje eliminacionih faza Polu finala
      .then((semiFinals) => {
        const semiFinalaTabela = document.querySelector('.semiFinalsTabela');
        const semiFinalaUtakmice = document.querySelector('.semiFinals');

        var winers = [];

        winers = proba(semiFinals, semiFinalaUtakmice, semiFinalaTabela);
         
        return winers;
      })
  
      // *************************************************************************
      // Igranje eliminacionih finale finala
      .then((final) => {        
        const finaleTabela = document.querySelector('.finalsTabela')
        const finaleUtakmice = document.querySelector('.final')
        
        var winers = [];

        winers = proba(final, finaleUtakmice, finaleTabela);
         
        return winers;
      })

      // *************************************************************************
      // FINALE
      .then((winer)=>{
        const winerShow = document.querySelector('.winer')
          winerShow.innerHTML += `
          <div class='group'>
              <table> 
                  <tr>
                      <th>Winer of the 2022 Qatar WORLD CUP</th>
                  </tr>
                  <tr>
                      <td>${winer[0].name}</td>
                  </tr>
              </table> 
          </div>
       `
      })
  }
  
  // // Funkcija za igranje utakmica eliminacione faze prvi i drugi iz svih grupa
  const eliminationGame = (x,y, where, idx) => {
    var teamA = Math.floor(Math.random() * 5);
    var teamB = Math.floor(Math.random() * 5);
  
    var winer;
  
    x.goals = teamA;
    y.goals = teamB;
  
    if(x.goals > y.goals){
      winer = x
    }
    if(x.goals < y.goals){
      winer = y
    }
    if (x.goals == y.goals) {
      winer = x
    }

    where.innerHTML += `
        <h2>Par: ${idx + 1} </h2>
        <p> ${x.name}  ${x.goals} : ${y.goals} ${y.name}  Pobednik je: ${winer.name}</p>
        <p> Dalje ide:  ${winer.name} </p>
    `
    return winer;
  }
  
  // Funkcija za igranje utakmica grupne faze svako sa svakim
  const groupGame = (x, y) => {
    var teamA = Math.floor(Math.random() * 5);
    var teamB = Math.floor(Math.random() * 5);
  
    var winer;
  
    x.goals = teamA;
    y.goals = teamB;
  
    if (x.goals > y.goals) {
      winer = `Pobednik je: ${x.name}. Rezultat utakmice: ${x.name} ${x.goals}: ${y.goals} ${y.name}`;
      x.points += 3;
      x.numWins += 1;
      y.numLoses += 1;
    }
    if (x.goals < y.goals) {
    
      winer = `Pobednik je: ${y.name}. Rezultat utakmice: ${y.name} ${y.goals}: ${x.goals} ${x.name}`;
      y.points += 3;
      y.numWins += 1;
      x.numLoses += 1;
    }
    if (x.goals == y.goals) {
      winer = `Utakmica je zavrsena nereseno:  ${x.name} ${x.goals} : ${y.goals} ${y.name} `
      x.points += 1;
      y.points += 1;
      x.numDraw += 1;
      y.numDraw += 1;
    }
    x.givenGoals += x.goals
    x.concededGoals += y.goals
    y.givenGoals += y.goals
    y.concededGoals += x.goals
    return winer;
  }
  
  // Play  function
  const play = (resJson) => {
    const allGameGropPhase = document.querySelector('.groupPhaseGames')
  
    resJson.forEach((element, idx)=> {
      allGameGropPhase.innerHTML += `
  
        <h2>Group: ${idx + 1}</h2>
        <h3>Prvo kolo Grupe ${idx + 1}</h3>
        <p>${groupGame(element[0], element[1])}</p>
        <p>${groupGame(element[2], element[3])}</p>
  
        <h3>Drugo kolo Grupe ${idx + 1}</h3>
        <p>${groupGame(element[0], element[2])}</p>
        <p>${groupGame(element[1], element[3])}</p>

        <h3>Trece kolo Grupe ${idx + 1}</h3>
        <p>${groupGame(element[0], element[3])}</p>
        <p>${groupGame(element[1], element[2])}</p>
      `
    });
  
    for (let i = 0; i < resJson.length; i++) {
      resJson[i].sort((b,a) =>{
        if(a.points == b.points){
          return (a.givenGoals - a.concededGoals) - (b.givenGoals - b.concededGoals)
        }
        else{
          return a.points - b.points;
        }
      }) 
      display(resJson);
    }
    return resJson;
  }

  // Mesanje protivnika igranje svako sa svakim i ispis
  const proba = (data, whereUtakmice, whereTable) =>{
        var allTeams = [];
        var groupA = [];
        var groupB = [];
        var reversedGroupB = [];
        var winers = [];
  
        data.forEach((element) => {
          allTeams = allTeams.concat(element);
        })
        groupA = allTeams.filter((element, idx) => {
          return idx % 2 === 0;
        });
        groupB = allTeams.filter((element, idx) => {
          return idx % 2 === 1;
        });
        reversedGroupB = groupB.reverse();

        for (let i = 0; i < groupA.length; i++) {
          winers.push(eliminationGame(groupA[i], reversedGroupB[i], whereUtakmice, i));
        }

        for (let i = 0; i < groupA.length; i++) {
          whereTable.innerHTML += `
            <div class='group'>
                <table> 
                    <tr>
                        <th>${i+1}. par</th>
                    </tr>
                    <tr>
                        <td>${groupA[i].name}</td>
                    </tr>
                    <tr>
                        <td>${groupB[i].name}</td>
                    </tr>
                </table> 
            </div>
          `
        }
        return winers;
  }
 
  // Ispis utakmica po grupama
  const display = (data) =>{
    const group = document.querySelectorAll('.group');
    for (let i = 0; i < data.length; i++) {
      group[i].innerHTML = `
        <h2>Group ${i+1}</h2>
          <table> 
             <tr>
                 <th>Team </th>
                 <th>W</th>
                 <th>D</th>
                 <th>L</th>
                 <th>GG:CG</th>
                 <th>PTS</th>
             </tr>
             <tr>
                 <td>${data[i][0].name} (${data[i][0].place})</td>
                 <td>${data[i][0].numWins}</td>
                 <td>${data[i][0].numDraw}</td>
                 <td>${data[i][0].numLoses}</td>
                 <td>${data[i][0].givenGoals}:${data[i][0].concededGoals}</td>
                 <td>${data[i][0].points}</td>
             </tr>
             <tr>
                 <td>${data[i][1].name} (${data[i][1].place})</td>
                 <td>${data[i][1].numWins}</td>
                 <td>${data[i][1].numDraw}</td>
                 <td>${data[i][1].numLoses}</td>
                 <td>${data[i][1].givenGoals}:${data[i][1].concededGoals}</td>
                 <td>${data[i][1].points}</td>
             </tr>
             <tr>
                 <td>${data[i][2].name} ${data[i][2].place})</td>
                 <td>${data[i][2].numWins}</td>
                 <td>${data[i][2].numDraw}</td>
                 <td>${data[i][2].numLoses}</td>
                 <td>${data[i][2].givenGoals}:${data[i][2].concededGoals}</td>
                 <td>${data[i][2].points}</td>
             </tr>
               <tr>
                 <td>${data[i][3].name} (${data[i][3].place})</td>
                 <td>${data[i][3].numWins}</td>
                 <td>${data[i][3].numDraw}</td>
                 <td>${data[i][3].numLoses}</td>
                 <td>${data[i][3].givenGoals}:${data[i][3].concededGoals}</td>
                 <td>${data[i][3].points}</td>
             </tr>
           </table> 
      `  
    }
  }