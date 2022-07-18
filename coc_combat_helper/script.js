let currentCombatList = [];
let currentCombatOrder = 0;

on("chat:message", function(msg) {
    if (msg.type == "api"){
        var apiMsgPrefix = '!ch';
        var apiMsgStart = apiMsgPrefix + ' start ';
        var apiMsgNextTurn = apiMsgPrefix + ' nt';
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
                sendChat('', '/desc ▼ 전투 개시 ▼');
                showCurrentCombatList();

                log(currentCombatList);
            }

            // 다음 차례로 넘기기(!ch nt)
            if (msg.content.indexOf(apiMsgNextTurn) === 0 && isCombating()) {
                const msgContent = msg.content.replace(apiMsgNextTurn, '');
                currentCombatOrder += 1;
                showCurrentCombatList();
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

function showCurrentCombatList() {
    const style = '[%s](#" style="font-weight:normal; font-style:normal;)';
    const currentStyle = '[%s](#" style="font-weight:bold; font-style:normal;)';
    const resultText = currentCombatList.map(
        function(obj, index){
            const turn = obj.get('name') + '(' + getCharacterDex(obj.id) + ')';
            return index === currentCombatOrder ? currentStyle.replace('%s', turn) : style.replace('%s', turn);
        }
    ).join(' [>>](#" style="font-weight:normal; font-style:normal;) ');
    sendChat('', '/desc § ' + resultText + ' §');
}