let currentCombatList = [];
let currentCombatOrder = 0;

on("chat:message", function(msg) {
    if (msg.type == "api"){
        var apiMsgPrefix = '!ch';
        var apiMsgStart = apiMsgPrefix + ' start ';
        var apiMsgEnd = apiMsgPrefix + ' end';

        try {
            // 전투 시작(!ch start)
            if (msg.content.indexOf(apiMsgStart) === 0 && !isCombating()) {
                const msgContent = msg.content.replace(apiMsgStart, '');
                const characterNameList = msgContent.split(',');
                var characterList = filterObjs(
                    function(obj){
                        if(obj.get('type') !== 'character') return false;
                        return characterNameList.some(function(name){ return obj.get('name').includes(name.trim()) });
                    }
                );
        
                characterList.sort((a, b) => {return getCharacterDex(b.id) - getCharacterDex(a.id)});
                currentCombatList = characterList.slice();
                const resultText = characterList.map(obj => obj.get('name') + '(' + getCharacterDex(obj.id) + ')').join(' >> ');
                sendChat('', '/desc 전투 순서');
                sendChat('', '/desc ' + resultText);

                log(currentCombatList);
            }

            // 전투 종료(!ch end)
            if (msg.content.indexOf(apiMsgEnd) === 0 && isCombating()) {
                currentCombatList.length = 0;
                currentCombatOrder = 0;
                sendChat('', '/desc ▲ 전투 종료 ▲');

                log(currentCombatList);
            }
        } catch (err) {
            sendChat('error','/w GM '+err,null,{noarchive:true});
        }
    }
});

function getCharacterDex(charId) {
    return parseInt(getAttrByName(charId, 'dex'));
}

function isCombating() {
    return currentCombatList.length > 0;
}
