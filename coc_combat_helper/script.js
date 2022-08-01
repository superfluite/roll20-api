let currentCombatList = [];
let currentCombatOrder = 0;

on("chat:message", function(msg) {
    if (msg.type == "api"){
        var apiMsgPrefix = '!ch';
        var apiMsgStart = apiMsgPrefix + ' start ';
        var apiMsgNextTurn = apiMsgPrefix + ' nt';
        var apiMsgEnd = apiMsgPrefix + ' end';

        const currentCharacter = currentCombatList.length > 0 ? currentCombatList[currentCombatOrder] : undefined;
        const calledByGM = playerIsGM(msg.playerid);
        const calledByCurrentPlayer = currentCharacter !== undefined ? currentCharacter.get('controlledby').split(',').includes(msg.playerid) : false;

        try {
            // 전투 시작(!ch start)
            if (calledByGM && msg.content.indexOf(apiMsgStart) === 0 && !isCombating()) {
                const msgContent = msg.content.replace(apiMsgStart, '');
                const characterNameList = msgContent.split(',');
                var characterList = filterObjs(
                    function(obj){
                        if(obj.get('type') !== 'character') return false;
                        return characterNameList.some(function(name){ return obj.get('name').includes(name.trim()) });
                    }
                );
        
                characterList.sort((a, b) => {
                    let result = getCharacterDex(b.id) - getCharacterDex(a.id);
                    if (result !== 0) { return result }
                    else {
                        return getCharacterBattleSkill(b.id) - getCharacterBattleSkill(a.id);
                    }
                });
                currentCombatList = characterList.slice();
                sendChat('', '/desc ▼ 전투 개시 ▼');
                showCurrentCombatList();

                log(currentCombatList);
            }

            // 다음 차례로 넘기기(!ch nt)
            if ((calledByGM || calledByCurrentPlayer) && msg.content.indexOf(apiMsgNextTurn) === 0 && isCombating()) {
                const msgContent = msg.content.replace(apiMsgNextTurn, '');
                currentCombatOrder += 1;
                if(currentCombatOrder >= currentCombatList.length) {
                    currentCombatOrder = 0;
                }
                showCurrentCombatList();
            }

            // 전투 종료(!ch end)
            if (calledByGM && msg.content.indexOf(apiMsgEnd) === 0 && isCombating()) {
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

function getCharacterIntAttr(charId, attr) {
    return parseInt(getAttrByName(charId, attr));
}

function getCharacterDex(charId) {
    return getCharacterIntAttr(charId, 'dex');
}

function getCharacterHP(charId, max=false) {
    const hp = getCharacterIntAttr(charId, 'hp', max ? 'max' : 'current');
    if (isNaN(hp)) {
        hp = (getCharacterIntAttr(charId, 'con') + getCharacterIntAttr(charId, 'siz')) % 10;
    }
    return hp
}

function getCharacterBattleSkill(charId, skill='fighting_brawl') {
    let skillValue = getCharacterIntAttr(charId, skill);
    if (isNaN(skillValue)) {
        skillValue = 25; // # FIXME 근접전(격투) 기본치임. 격투 기능에 따라 기본치가 다르므로 이를 고려해야 함
        createObj('attribute', {name: skill, current: skillValue, characterId: charId});
    }
    return skillValue;
}

function isCombating() {
    return currentCombatList.length > 0;
}

function showCurrentCombatList() {
    const style = '[%s](#" style="font-weight:normal; font-style:normal;)';
    const currentStyle = '[%s](#" style="font-weight:bold; font-style:normal;)';
    const resultText = currentCombatList.map(
        function(obj, index){
            const turn = obj.get('name') + '(' + getCharacterDex(obj.id) + ', ' + getCharacterHP(obj.id) + '/' + getCharacterHP(obj.id, true) + ')';
            return index === currentCombatOrder ? currentStyle.replace('%s', turn) : style.replace('%s', turn);
        }
    ).join(' [>>](#" style="font-weight:normal; font-style:normal;) ');
    sendChat('', '/desc § ' + resultText + ' §');
}