const { exec } = require('child_process');

function main() {
    exec('holehe --no-color --only-used -NP ' + process.argv[2], (error, stdout, stderr) => {
        if (error == undefined) {
            try {
                const results = [];
                
                const splitList = stdout.split('[+] ');
                
                if (splitList.length <= 2) throw new Error('no results found');

                for (let i = 1; i < splitList.length - 1; i++) {
                    results.push(splitList[i].trim());    
                }

                console.log(JSON.stringify(results));
            } catch (err) {
                console.log(JSON.stringify([]));
            }
        } else {
            console.log(JSON.stringify([]));
        }
    });
}

main()