<script>
        let userId = '';
        let coins = 0;
        let currentGame = null;
        let gameState = {};
        let isFirstLogin = false;
        let deviceInfo = '';

        const GOOGLE_FORM_ID = '1FAIpQLSdl_2E4xKXN8aMw9MLUFQGkfWaVR-0C95pgPIGT7wc6rQXujA';
        const USER_ID_ENTRY = 'entry.734820015';        // User ID (device info format)
        const USER_ACTIVITY_ENTRY = 'entry.2004900081';  // User activity (playing snake/new login/etc)
        const COIN_AMOUNT_ENTRY = 'entry.1759634509';    // Coin amount (+10000, +500, -500, etc)
        const SHEET_ID = '1MkHoiDbe1j67EJoB-xpp_YOUR_ACTUAL_SHEET_ID_HERE';

        const randomActivities = [
            { user: 'Player123', action: 'completed Snake game', coins: 15 },
            { user: 'GamerX', action: 'answered quiz question', coins: 8 },
            { user: 'CoinHunter', action: 'won scratch card', coins: 25 },
            { user: 'PuzzleMaster', action: 'solved memory game', coins: 12 },
            { user: 'SlotWinner', action: 'hit jackpot', coins: 50 },
            { user: 'QuizPro', action: 'perfect quiz score', coins: 20 },
            { user: 'SnakeKing', action: 'high score achieved', coins: 30 },
            { user: 'LuckyPlayer', action: 'bonus round won', coins: 18 },
            { user: 'BrainTester', action: 'puzzle solved', coins: 14 },
            { user: 'ClickMaster', action: 'clicking spree', coins: 22 },
            { user: 'SpeedRunner', action: 'completed level fast', coins: 35 },
            { user: 'ComboKing', action: 'achieved combo streak', coins: 28 },
            { user: 'TreasureHunter', action: 'found hidden bonus', coins: 40 },
            { user: 'ChampionPlayer', action: 'won tournament', coins: 60 },
            { user: 'MasterGamer', action: 'unlocked achievement', coins: 32 },
            { user: 'CoinCollector', action: 'daily bonus claimed', coins: 15 },
            { user: 'GameNinja', action: 'perfect memory match', coins: 24 },
            { user: 'SlotMaster', action: 'triple sevens hit', coins: 45 },
            { user: 'PuzzleWiz', action: 'math challenge won', coins: 18 },
            { user: 'SnakeChamp', action: 'ate 50 apples', coins: 38 },
            { user: 'ScratchLuck', action: 'golden ticket found', coins: 55 },
            { user: 'ClickerPro', action: '1000 clicks achieved', coins: 26 },
            { user: 'MemoryKing', action: 'level 10 completed', coins: 42 },
            { user: 'QuizGenius', action: '20 questions streak', coins: 33 },
            { user: 'BonusHunter', action: 'secret area found', coins: 48 },
            { user: 'GameMaster', action: 'all games completed', coins: 75 },
            { user: 'CoinRush', action: 'speed bonus earned', coins: 29 },
            { user: 'LuckyStreak', action: 'won 5 games in row', coins: 65 },
            { user: 'PerfectPlayer', action: 'flawless victory', coins: 52 },
            { user: 'TrophyHunter', action: 'rare achievement', coins: 44 }
        ];

        const quizQuestions = [
            "Do you enjoy playing mobile games?",
            "Is gaming a good way to relax after work?",
            "Do you prefer puzzle games over action games?",
            "Are free games better than paid games?",
            "Do you think gaming improves problem-solving skills?",
            "Is it fun to compete with friends in games?",
            "Do you enjoy games with colorful graphics?",
            "Are simple games more addictive than complex ones?",
            "Do you like games that reward daily play?",
            "Is it satisfying to collect coins in games?",
            "Do you prefer games you can play in short sessions?",
            "Are retro-style games still enjoyable today?",
            "Do you think mobile gaming is the future?",
            "Is it important to have good sound effects in games?",
            "Do you enjoy games that challenge your memory?",
            "Are multiplayer games more fun than single player?",
            "Do you like games with storylines?",
            "Is it worth spending money on game upgrades?",
            "Do you prefer games with realistic graphics?",
            "Are puzzle games good for brain training?"
        ];

        const avatarImages = [
            "https://cdn-icons-png.flaticon.com/512/1960/1960884.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960887.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960888.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960890.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960891.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960892.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960893.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960894.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960895.png",
            "https://cdn-icons-png.flaticon.com/512/1960/1960896.png"
        ];

        function generateDeviceInfo() {
            const deviceId = Math.random().toString(36).substr(2, 8).toUpperCase();
            const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
            const resolution = `${screen.width}x${screen.height}`;
            return `${deviceId}-${ip}-${resolution}`;
        }

        function generateUserId() {
            return Math.random().toString(36).substr(2, 9).toUpperCase();
        }

        function awardCoins(amount, action) {
            const randomBonus = Math.floor(Math.random() * 5) + 1;
            const totalCoins = amount + randomBonus;
            
            coins += totalCoins;
            localStorage.setItem('coins', coins.toString());
            updateDisplay();
            
            logToGoogleForm(action, totalCoins);
            
            // Visual feedback
            showCoinAnimation(totalCoins);
            
            console.log(`[v0] Awarded ${totalCoins} coins for ${action}`);
        }

        function logToGoogleForm(action, coinChange, extraData = {}) {
            const formUrl = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/formResponse`;
            
            // Format coin change with + or - prefix
            const coinAmount = coinChange > 0 ? `+${coinChange}` : `${coinAmount}`;
            
            let fullAction = action;
            if (extraData.deviceExample && extraData.deviceId) {
                fullAction = `${action} - Example: ${extraData.deviceExample}, Device ID: ${extraData.deviceId}`;
            }
            
            // Method 1: GET request with URLSearchParams
            const getParams = new URLSearchParams();
            getParams.append(USER_ID_ENTRY, userId);
            getParams.append(USER_ACTIVITY_ENTRY, fullAction);
            getParams.append(COIN_AMOUNT_ENTRY, coinAmount);
            const getUrl = `${formUrl}?${getParams.toString()}`;
            
            fetch(getUrl, { 
                method: 'GET', 
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }).then(() => {
                console.log(`[v0] Form submitted via GET: ${fullAction}, ${coinAmount} coins`);
            }).catch(e => {
                console.log('[v0] GET submission error:', e);
            });
            
            // Method 2: POST request with FormData
            setTimeout(() => {
                const formData = new FormData();
                formData.append(USER_ID_ENTRY, userId);
                formData.append(USER_ACTIVITY_ENTRY, fullAction);
                formData.append(COIN_AMOUNT_ENTRY, coinAmount);
                
                fetch(formUrl, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                }).then(() => {
                    console.log(`[v0] Form submitted via POST: ${fullAction}, ${coinAmount} coins`);
                }).catch(e => {
                    console.log('[v0] POST submission error:', e);
                });
            }, 500);
            
            // Method 3: Image pixel method as backup
            setTimeout(() => {
                const img = new Image();
                img.onload = () => console.log(`[v0] Form submitted via image pixel: ${fullAction}, ${coinAmount} coins`);
                img.onerror = () => console.log('[v0] Image pixel submission error');
                img.src = getUrl;
            }, 1000);
            
            // Method 4: XMLHttpRequest as additional backup
            setTimeout(() => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', formUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        console.log(`[v0] XHR submission completed: ${fullAction}, ${coinAmount} coins`);
                    }
                };
                const postData = `${USER_ID_ENTRY}=${encodeURIComponent(userId)}&${USER_ACTIVITY_ENTRY}=${encodeURIComponent(fullAction)}&${COIN_AMOUNT_ENTRY}=${encodeURIComponent(coinAmount)}`;
                xhr.send(postData);
            }, 1500);
        }

        function fetchUserDataFromSheet() {
            if (!SHEET_ID.includes('YOUR_ACTUAL_SHEET_ID')) {
                console.log('[v0] Please update SHEET_ID with your actual Google Sheet ID');
                document.getElementById('sheetStatus').textContent = 'Sheet ID needed ⚠️';
                return;
            }
            
            const sheetUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0&headers=1`;
            
            fetch(sheetUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json, text/plain, */*'
                }
            }).then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            }).then(text => {
                try {
                    // Parse Google Sheets JSON response
                    const jsonText = text.substring(47).slice(0, -2);
                    const data = JSON.parse(jsonText);
                    
                    let totalCoins = 0;
                    let userFound = false;
                    let activityCount = 0;
                    
                    if (data.table && data.table.rows) {
                        data.table.rows.forEach(row => {
                            if (row.c && row.c[0] && row.c[0].v === userId) {
                                userFound = true;
                                activityCount++;
                                // Parse coin amount from third column (entry.1759634509)
                                if (row.c[2] && row.c[2].v) {
                                    const coinValue = row.c[2].v.toString().replace('+', '');
                                    const coins = parseInt(coinValue);
                                    if (!isNaN(coins)) {
                                        totalCoins += coins;
                                    }
                                }
                            }
                        });
                    }
                    
                    if (userFound) {
                        document.getElementById('sheetCoins').textContent = totalCoins;
                        document.getElementById('sheetStatus').textContent = `✅ (${activityCount} activities)`;
                        console.log(`[v0] Sheet data loaded: ${totalCoins} coins, ${activityCount} activities`);
                    } else {
                        document.getElementById('sheetStatus').textContent = 'No data yet ⏳';
                        console.log('[v0] User not found in sheet data');
                    }
                } catch (error) {
                    console.log('[v0] Sheet parsing error:', error);
                    document.getElementById('sheetStatus').textContent = 'Parse error ❌';
                }
            }).catch(error => {
                console.log('[v0] Sheet fetch error:', error);
                document.getElementById('sheetStatus').textContent = 'Offline ❌';
            });
        }

        function startActivityFeed() {
            // Show initial activities immediately
            for (let i = 0; i < 8; i++) {
                setTimeout(() => addRandomActivity(), i * 150);
            }
            
            // Continue showing activities every 1-3 seconds for more activity
            setInterval(() => {
                addRandomActivity();
            }, 1000 + Math.random() * 2000);
        }

        function generateActivity() {
            const activities = [
                { action: 'playing_snake', text: 'completed Snake Game', coins: '+5', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991633.png' },
                { action: 'new_login', text: 'joined the platform', coins: '+10000', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png' },
                { action: 'scratch_win', text: 'won Scratch & Win', coins: '+12', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991574.png' },
                { action: 'slot_jackpot', text: 'hit Lucky Slots jackpot', coins: '+20', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991895.png' },
                { action: 'memory_complete', text: 'completed Memory Test', coins: '+4', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
                { action: 'clicker_bonus', text: 'earned Clicker bonus', coins: '+8', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991185.png' },
                { action: 'puzzle_solved', text: 'solved Number Puzzle', coins: '+6', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991620.png' },
                { action: 'question_correct', text: 'answered question correctly', coins: '+2', icon: 'https://cdn-icons-png.flaticon.com/512/189/189665.png' },
                { action: 'daily_bonus', text: 'claimed daily bonus', coins: '+50', icon: 'https://cdn-icons-png.flaticon.com/512/3135/3135706.png' },
                { action: 'referral_bonus', text: 'earned referral bonus', coins: '+25', icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png' },
                { action: 'level_up', text: 'leveled up', coins: '+15', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991110.png' },
                { action: 'achievement', text: 'unlocked achievement', coins: '+30', icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991574.png' }
            ];

            const usernames = ['Player123', 'GamerPro', 'CoinHunter', 'SnakeKing', 'LuckyWinner', 'PuzzleMaster', 'QuizChamp', 'SlotStar', 'MemoryGuru', 'ClickerHero'];
            
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const username = usernames[Math.floor(Math.random() * usernames.length)];
            
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <img src="${activity.icon}" alt="${activity.action}" class="activity-icon">
                <span class="user">${username}</span> ${activity.text} 
                <span class="coins">${activity.coins} coins</span>
            `;
            
            const activityList = document.getElementById('activityList');
            activityList.insertBefore(activityItem, activityList.firstChild);
            activityItem.classList.add('new-activity');
            setTimeout(() => activityItem.classList.remove('new-activity'), 1500);
            
            // Keep only last 10 activities
            while (activityList.children.length > 10) {
                activityList.removeChild(activityList.lastChild);
            }
        }

        function addRandomActivity() {
            generateActivity();
        }

        function openPopup(popupId) {
            document.getElementById(popupId).style.display = 'flex';
            if (Math.random() < 0.2) { // Only 20% chance
                setTimeout(() => openBackgroundLink(), 500);
            }
        }

        function closePopup(popupId) {
            document.getElementById(popupId).style.display = 'none';
        }

        function openBackgroundLink() {
            try {
                window.open('https://www.effectivegatecpm.com/t50w2dusv?key=b1ab0350a3bfdb005a7b18f1670f36d4', '_blank');
            } catch (e) {
                console.log('[v0] Background link error:', e);
            }
        }

        function goToReview() {
            const deviceExample = document.getElementById('deviceExample').value;
            const deviceId = document.getElementById('deviceId').value;
            const coinAmount = document.getElementById('coinAmount').value;
            
            if (!deviceId || !coinAmount) {
                showNotification('Please fill in device ID and coin amount ⚠️');
                return;
            }
            
            document.getElementById('reviewUserId').textContent = userId;
            document.getElementById('reviewDeviceExample').textContent = deviceExample;
            document.getElementById('reviewDeviceId').textContent = deviceId;
            document.getElementById('reviewCoinAmount').textContent = coinAmount;
            
            document.getElementById('settingsStep1').style.display = 'none';
            document.getElementById('settingsStep2').style.display = 'block';
        }

        function goBackToInput() {
            document.getElementById('settingsStep1').style.display = 'block';
            document.getElementById('settingsStep2').style.display = 'none';
        }

        function submitDeviceData() {
            const deviceExample = document.getElementById('deviceExample').value;
            const deviceId = document.getElementById('deviceId').value;
            const coinAmount = parseInt(document.getElementById('coinAmount').value);
            
            if (deviceId && coinAmount && coinAmount > 0) {
                deviceInfo = deviceId;
                localStorage.setItem('deviceInfo', deviceInfo);
                
                awardCoins(coinAmount, 'device_data_submitted', { deviceExample, deviceId });
                
                updateDisplay();
                showNotification(`Device data submitted! +${coinAmount} coins added! 📱`);
                closePopup('settingsPopup');
            } else {
                showNotification('Please fill in both device ID and coin amount! ⚠️');
            }
        }

        function showCoinAnimation(amount) {
            const coinElement = document.getElementById('coinBalance');
            coinElement.style.animation = 'coinBurst 0.6s ease-out';
            
            setTimeout(() => {
                coinElement.style.animation = '';
            }, 600);
        }

        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                // Reduced chance to avoid too many tabs
                setTimeout(() => {
                    if (Math.random() < 0.15) { // Only 15% chance
                        openBackgroundLink();
                    }
                }, 200);
            }
        });

        function answerQuestion(answer) {
            const bonusCoins = Math.floor(Math.random() * 15) + 5;
            awardCoins(bonusCoins, `quiz_answered_${answer}`);
            
            showNotification(`Great answer! +${bonusCoins} coins! 🎯`);
            loadRandomQuestion();
        }

        function updateDisplay() {
            document.getElementById('userId').textContent = userId;
            document.getElementById('coinBalance').textContent = coins;
            document.getElementById('deviceDisplay').textContent = deviceInfo.substring(0, 12) + '...';
            document.getElementById('currentDeviceInfo').textContent = deviceInfo;
            
            // Update sheet data
            fetchUserDataFromSheet();
        }

        function loadRandomQuestion() {
            const questionElement = document.getElementById('currentQuestion');
            const randomIndex = Math.floor(Math.random() * quizQuestions.length);
            questionElement.textContent = quizQuestions[randomIndex];
        }

        function startGame(gameType) {
            currentGame = gameType;
            const canvas = document.getElementById('gameCanvas');
            const controls = document.getElementById('gameControls');
            
            // Ensure canvas is properly initialized
            if (!canvas.getContext) {
                showNotification('Canvas not supported! Please use a modern browser! 😞');
                return;
            }
            
            openBackgroundLink();
            document.getElementById('gamePopup').style.display = 'flex';
            canvas.width = 350;
            canvas.height = 350;
            canvas.style.display = 'block';
            controls.style.display = 'flex';
            
            // Award coins for starting game
            awardCoins(3, `game_started_${gameType}`);
            
            try {
                switch(gameType) {
                    case 'snake':
                        initSnakeGame();
                        break;
                    case 'scratch':
                        initScratchGame();
                        break;
                    case 'slot':
                        initSlotGame();
                        break;
                    case 'memory':
                        initMemoryGame();
                        break;
                    case 'clicker':
                        initClickerGame();
                        break;
                    case 'puzzle':
                        initPuzzleGame();
                        break;
                    default:
                        throw new Error(`Unknown game type: ${gameType}`);
                }
                showNotification(`${gameType.charAt(0).toUpperCase() + gameType.slice(1)} game started! 🎮`);
            } catch (error) {
                console.log('[v0] Game initialization error:', error);
                showNotification('Game loading... Please try again! 🎮');
                closeGamePopup();
            }
        }

        function closeGamePopup() {
            document.getElementById('gamePopup').style.display = 'none';
            const canvas = document.getElementById('gameCanvas');
            const controls = document.getElementById('gameControls');
            canvas.style.display = 'none';
            controls.style.display = 'none';
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            if (currentGame) {
                // Award coins for playing and log to Google Form
                awardCoins(5, `game_completed_${currentGame}`);
                currentGame = null;
            }
            
            gameState = {};
            showNotification('Game closed! Thanks for playing! 🎯');
        }

        function initSnakeGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            gameState = {
                snake: [{x: 175, y: 175}],
                food: {x: 100, y: 100},
                direction: {x: 0, y: 0},
                score: 0,
                gameRunning: true
            };
            
            function gameLoop() {
                if (currentGame !== 'snake' || !gameState.gameRunning) return;
                
                // Move snake
                const head = {
                    x: gameState.snake[0].x + gameState.direction.x * 17,
                    y: gameState.snake[0].y + gameState.direction.y * 17
                };
                
                // Check walls
                if (head.x < 0 || head.x >= 350 || head.y < 0 || head.y >= 350) {
                    gameState.gameRunning = false;
                    awardCoins(gameState.score * 2, 'snake_game_completed');
                    showNotification(`Game Over! Score: ${gameState.score} 🐍`);
                    setTimeout(closeGamePopup, 2000);
                    return;
                }
                
                // Check self collision
                for (let segment of gameState.snake) {
                    if (head.x === segment.x && head.y === segment.y) {
                        gameState.gameRunning = false;
                        awardCoins(gameState.score * 2, 'snake_game_completed');
                        showNotification(`Game Over! Score: ${gameState.score} 🐍`);
                        setTimeout(closeGamePopup, 2000);
                        return;
                    }
                }
                
                gameState.snake.unshift(head);
                
                // Check food
                if (Math.abs(head.x - gameState.food.x) < 17 && Math.abs(head.y - gameState.food.y) < 17) {
                    gameState.score++;
                    awardCoins(2, 'snake_food_eaten');
                    gameState.food = {
                        x: Math.floor(Math.random() * 20) * 17,
                        y: Math.floor(Math.random() * 20) * 17
                    };
                } else {
                    gameState.snake.pop();
                }
                
                // Draw
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 350, 350);
                
                // Draw snake
                ctx.fillStyle = '#0ea5e9';
                gameState.snake.forEach((segment, index) => {
                    if (index === 0) {
                        ctx.fillStyle = '#fbbf24'; // Head color
                    } else {
                        ctx.fillStyle = '#0ea5e9'; // Body color
                    }
                    ctx.fillRect(segment.x, segment.y, 15, 15);
                });
                
                // Draw food
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(gameState.food.x, gameState.food.y, 15, 15);
                
                // Draw score
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.fillText(`Score: ${gameState.score}`, 10, 25);
                
                setTimeout(gameLoop, 120);
            }
            
            gameLoop();
        }

        function initScratchGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            const prizes = [5, 8, 12, 15, 20, 25];
            const prize = prizes[Math.floor(Math.random() * prizes.length)];
            
            gameState = {
                scratched: false,
                prize: prize,
                scratchAreas: []
            };
            
            // Draw scratch card background
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(0, 0, 350, 350);
            ctx.fillStyle = '#000';
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${prize} COINS!`, 175, 175);
            
            // Draw scratch overlay
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(0, 0, 350, 350);
            ctx.fillStyle = '#000';
            ctx.font = '20px Arial';
            ctx.fillText('Scratch to reveal!', 175, 175);
            ctx.fillText('Click and drag!', 175, 200);
            
            let isScratching = false;
            let scratchedArea = 0;
            
            function scratch(x, y) {
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(x, y, 15, 0, 2 * Math.PI);
                ctx.fill();
                ctx.globalCompositeOperation = 'source-over';
                scratchedArea += 225; // Approximate area of circle
                
                if (scratchedArea > 15000 && !gameState.scratched) { // About 12% of card
                    gameState.scratched = true;
                    awardCoins(prize, 'scratch_card_won');
                    showNotification(`You won ${prize} coins! 🎫`);
                    setTimeout(closeGamePopup, 3000);
                }
            }
            
            canvas.addEventListener('mousedown', (e) => {
                isScratching = true;
                const rect = canvas.getBoundingClientRect();
                scratch(e.clientX - rect.left, e.clientY - rect.top);
            });
            
            canvas.addEventListener('mousemove', (e) => {
                if (isScratching) {
                    const rect = canvas.getBoundingClientRect();
                    scratch(e.clientX - rect.left, e.clientY - rect.top);
                }
            });
            
            canvas.addEventListener('mouseup', () => {
                isScratching = false;
            });
            
            // Touch events for mobile
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isScratching = true;
                const rect = canvas.getBoundingClientRect();
                const touch = e.touches[0];
                scratch(touch.clientX - rect.left, touch.clientY - rect.top);
            });
            
            canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                if (isScratching) {
                    const rect = canvas.getBoundingClientRect();
                    const touch = e.touches[0];
                    scratch(touch.clientX - rect.left, touch.clientY - rect.top);
                }
            });
            
            canvas.addEventListener('touchend', (e) => {
                e.preventDefault();
                isScratching = false;
            });
        }


        function initSlotGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '⭐', '🔔'];
            let spinning = false;
            
            function spin() {
                if (spinning) return;
                spinning = true;
                
                // Animation effect
                let animationFrames = 0;
                const maxFrames = 30;
                
                function animate() {
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, 350, 350);
                    
                    // Draw spinning effect
                    ctx.fillStyle = '#fff';
                    ctx.font = '48px Arial';
                    ctx.textAlign = 'center';
                    
                    if (animationFrames < maxFrames) {
                        // Show random symbols while spinning
                        for (let i = 0; i < 3; i++) {
                            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                            ctx.fillText(randomSymbol, 90 + i * 85, 175);
                        }
                        animationFrames++;
                        setTimeout(animate, 50);
                    } else {
                        // Show final result
                        const result = [
                            symbols[Math.floor(Math.random() * symbols.length)],
                            symbols[Math.floor(Math.random() * symbols.length)],
                            symbols[Math.floor(Math.random() * symbols.length)]
                        ];
                        
                        result.forEach((symbol, i) => {
                            ctx.fillText(symbol, 90 + i * 85, 175);
                        });
                        
                        // Check for wins
                        let winAmount = 0;
                        if (result[0] === result[1] && result[1] === result[2]) {
                            winAmount = result[0] === '💎' ? 25 : result[0] === '⭐' ? 20 : 15;
                        } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
                            winAmount = 8;
                        } else {
                            winAmount = 3; // Consolation prize
                        }
                        
                        awardCoins(winAmount, 'slot_machine_spin');
                        
                        ctx.font = '20px Arial';
                        ctx.fillText(`+${winAmount} coins!`, 175, 250);
                        ctx.font = '16px Arial';
                        ctx.fillText('Tap to spin again!', 175, 300);
                        
                        showNotification(`Slot result: +${winAmount} coins! 🎰`);
                        spinning = false;
                    }
                }
                animate();
            }
            
            canvas.addEventListener('click', spin);
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                spin();
            });
            
            // Initial display
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, 350, 350);
            ctx.fillStyle = '#fff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎰 LUCKY SLOTS 🎰', 175, 100);
            ctx.font = '16px Arial';
            ctx.fillText('Tap to spin!', 175, 200);
            ctx.fillText('Match symbols to win!', 175, 250);
        }

        function initMemoryGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            const sequence = [];
            const playerSequence = [];
            let level = 1;
            let showingSequence = false;
            let gameActive = true;
            
            gameState = {
                sequence: sequence,
                playerSequence: playerSequence,
                level: level,
                gameActive: gameActive
            };
            
            const colors = ['#ff4444', '#44ff44', '#4444ff', '#ffff44'];
            const positions = [
                {x: 25, y: 25, w: 150, h: 150},
                {x: 175, y: 25, w: 150, h: 150},
                {x: 25, y: 175, w: 150, h: 150},
                {x: 175, y: 175, w: 150, h: 150}
            ];
            
            function addToSequence() {
                sequence.push(Math.floor(Math.random() * 4));
            }
            
            function showSequence() {
                showingSequence = true;
                let i = 0;
                
                function showNext() {
                    drawGrid();
                    
                    if (i < sequence.length) {
                        // Highlight current sequence item
                        ctx.fillStyle = colors[sequence[i]];
                        const pos = positions[sequence[i]];
                        ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
                        
                        setTimeout(() => {
                            drawGrid();
                            i++;
                            setTimeout(showNext, 200);
                        }, 600);
                    } else {
                        showingSequence = false;
                    }
                }
                showNext();
            }
            
            function drawGrid() {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 350, 350);
                
                // Draw grid
                positions.forEach((pos, index) => {
                    ctx.fillStyle = '#333';
                    ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(pos.x, pos.y, pos.w, pos.h);
                });
                
                // Draw level info
                ctx.fillStyle = '#fff';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(`Level ${level}`, 175, 20);
            }
            
            function handleClick(e) {
                if (showingSequence || !gameActive) return;
                
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                let clicked = -1;
                positions.forEach((pos, index) => {
                    if (x >= pos.x && x <= pos.x + pos.w && y >= pos.y && y <= pos.y + pos.h) {
                        clicked = index;
                    }
                });
                
                if (clicked !== -1) {
                    playerSequence.push(clicked);
                    
                    // Flash the clicked button
                    ctx.fillStyle = colors[clicked];
                    const pos = positions[clicked];
                    ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
                    setTimeout(() => drawGrid(), 200);
                    
                    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
                        gameActive = false;
                        awardCoins(level * 3, 'memory_game_completed');
                        showNotification(`Game Over! Reached Level ${level}! 🧠`);
                        setTimeout(closeGamePopup, 2000);
                        return;
                    }
                    
                    if (playerSequence.length === sequence.length) {
                        level++;
                        awardCoins(5, 'memory_level_completed');
                        playerSequence.length = 0;
                        addToSequence();
                        setTimeout(() => {
                            if (gameActive) showSequence();
                        }, 1000);
                    }
                }
            }
            
            canvas.addEventListener('click', handleClick);
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleClick(e.touches[0]);
            });
            
            addToSequence();
            drawGrid();
            setTimeout(() => showSequence(), 1000);
        }

        function initClickerGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            let clicks = 0;
            let timeLeft = 15;
            let gameActive = true;
            
            function draw() {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 350, 350);
                
                // Draw coin
                ctx.fillStyle = '#fbbf24';
                ctx.font = '80px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('🪙', 175, 200);
                
                // Draw stats
                ctx.fillStyle = '#fff';
                ctx.font = '20px Arial';
                ctx.fillText(`Clicks: ${clicks}`, 175, 80);
                ctx.fillText(`Time: ${timeLeft}s`, 175, 280);
                ctx.font = '16px Arial';
                ctx.fillText('Click the coin fast!', 175, 320);
            }
            
            const timer = setInterval(() => {
                if (!gameActive) {
                    clearInterval(timer);
                    return;
                }
                
                timeLeft--;
                if (timeLeft <= 0) {
                    gameActive = false;
                    clearInterval(timer);
                    awardCoins(clicks, 'clicker_game_completed');
                    showNotification(`Time's up! ${clicks} clicks = ${clicks} coins! 👆`);
                    setTimeout(closeGamePopup, 2000);
                }
                draw();
            }, 1000);
            
            function handleClick() {
                if (timeLeft > 0 && gameActive) {
                    clicks++;
                    awardCoins(1, 'coin_clicked');
                    
                    // Visual feedback
                    ctx.fillStyle = '#fff';
                    ctx.font = '60px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('🪙', 175, 200);
                    setTimeout(draw, 100);
                }
            }
            
            canvas.addEventListener('click', handleClick);
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handleClick();
            });
            
            draw();
        }

        function initPuzzleGame() {
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            
            function generatePuzzle() {
                const operations = ['+', '-', '*'];
                const op = operations[Math.floor(Math.random() * operations.length)];
                let a, b, answer;
                
                switch(op) {
                    case '+':
                        a = Math.floor(Math.random() * 50) + 1;
                        b = Math.floor(Math.random() * 50) + 1;
                        answer = a + b;
                        break;
                    case '-':
                        a = Math.floor(Math.random() * 50) + 25;
                        b = Math.floor(Math.random() * 25) + 1;
                        answer = a - b;
                        break;
                    case '*':
                        a = Math.floor(Math.random() * 12) + 1;
                        b = Math.floor(Math.random() * 12) + 1;
                        answer = a * b;
                        break;
                }
                
                const wrongAnswers = [
                    answer + Math.floor(Math.random() * 10) + 1,
                    answer - Math.floor(Math.random() * 10) - 1,
                    Math.floor(answer * 1.5),
                    Math.floor(answer * 0.7)
                ].filter(x => x !== answer && x > 0);
                
                const options = [answer, ...wrongAnswers.slice(0, 2)].sort(() => Math.random() - 0.5);
                
                return {
                    question: `${a} ${op} ${b} = ?`,
                    options: options,
                    answer: answer
                };
            }
            
            const puzzle = generatePuzzle();
            
            function draw() {
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 350, 350);
                ctx.fillStyle = '#fff';
                ctx.font = '28px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(puzzle.question, 175, 80);
                
                // Draw options
                puzzle.options.forEach((option, i) => {
                    ctx.fillStyle = '#0ea5e9';
                    ctx.fillRect(50, 120 + i * 60, 250, 45);
                    ctx.fillStyle = '#fff';
                    ctx.font = '20px Arial';
                    ctx.fillText(option.toString(), 175, 150 + i * 60);
                });
            }
            
            function handleClick(e) {
                const rect = canvas.getBoundingClientRect();
                const y = e.clientY - rect.top;
                
                const optionIndex = Math.floor((y - 120) / 60);
                if (optionIndex >= 0 && optionIndex < puzzle.options.length) {
                    const selectedAnswer = puzzle.options[optionIndex];
                    
                    if (selectedAnswer === puzzle.answer) {
                        awardCoins(8, 'puzzle_solved_correct');
                        showNotification('Correct! +8 coins! 🧩');
                    } else {
                        awardCoins(2, 'puzzle_solved_wrong');
                        showNotification('Wrong answer, but +2 coins for trying! 🤔');
                    }
                    
                    setTimeout(closeGamePopup, 2000);
                }
            }
            
            canvas.addEventListener('click', handleClick);
            canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                handleClick(touch);
            });
            
            draw();
        }

        function setupControls() {
            // Touch and keyboard controls for games
            document.getElementById('upBtn').onclick = () => {
                if (currentGame === 'snake' && gameState.gameRunning) {
                    if (gameState.direction.y === 0) { // Prevent reverse direction
                        gameState.direction = {x: 0, y: -1};
                    }
                }
            };
            document.getElementById('downBtn').onclick = () => {
                if (currentGame === 'snake' && gameState.gameRunning) {
                    if (gameState.direction.y === 0) {
                        gameState.direction = {x: 0, y: 1};
                    }
                }
            };
            document.getElementById('leftBtn').onclick = () => {
                if (currentGame === 'snake' && gameState.gameRunning) {
                    if (gameState.direction.x === 0) {
                        gameState.direction = {x: -1, y: 0};
                    }
                }
            };
            document.getElementById('rightBtn').onclick = () => {
                if (currentGame === 'snake' && gameState.gameRunning) {
                    if (gameState.direction.x === 0) {
                        gameState.direction = {x: 1, y: 0};
                    }
                }
            };
            
            // Keyboard controls
            document.addEventListener('keydown', (e) => {
                if (currentGame === 'snake' && gameState.gameRunning) {
                    switch(e.key) {
                        case 'ArrowUp': 
                            if (gameState.direction.y === 0) {
                                gameState.direction = {x: 0, y: -1}; 
                            }
                            break;
                        case 'ArrowDown': 
                            if (gameState.direction.y === 0) {
                                gameState.direction = {x: 0, y: 1}; 
                            }
                            break;
                        case 'ArrowLeft': 
                            if (gameState.direction.x === 0) {
                                gameState.direction = {x: -1, y: 0}; 
                            }
                            break;
                        case 'ArrowRight': 
                            if (gameState.direction.x === 0) {
                                gameState.direction = {x: 1, y: 0}; 
                            }
                            break;
                    }
                }
            });
        }

        function pauseGame() {
            if (currentGame && gameState.gameRunning !== undefined) {
                gameState.gameRunning = !gameState.gameRunning;
                showNotification(gameState.gameRunning ? 'Game resumed! ▶️' : 'Game paused! ⏸️');
            }
        }

        function restartGame() {
            if (currentGame) {
                closeGamePopup();
                setTimeout(() => startGame(currentGame), 500);
                showNotification('Game restarted! 🔄');
            }
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        function showFirstLoginCelebration() {
            showNotification('🎉 Welcome! You got 10,000 bonus coins! 🎉');
            
            // Create celebration particles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.style.position = 'fixed';
                    particle.style.left = Math.random() * window.innerWidth + 'px';
                    particle.style.top = '-10px';
                    particle.style.fontSize = '20px';
                    particle.style.zIndex = '9999';
                    particle.style.pointerEvents = 'none';
                    particle.textContent = ['🎉', '🪙', '⭐', '🎯', '🏆'][Math.floor(Math.random() * 5)];
                    particle.style.animation = 'fall 3s linear forwards';
                    
                    document.body.appendChild(particle);
                    
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 3000);
                }, i * 100);
            }
        }

        function initializeUser() {
            // Set random attractive logo for user avatar
            document.getElementById('userAvatar').src = avatarImages[Math.floor(Math.random() * avatarImages.length)];

            // Generate device info
            deviceInfo = localStorage.getItem('deviceInfo') || generateDeviceInfo();
            localStorage.setItem('deviceInfo', deviceInfo);
            
            userId = localStorage.getItem('userid');
            if (!localStorage.getItem('userid')) {
                userId = generateDeviceInfo();
                localStorage.setItem('userid', userId);
                isFirstLogin = true;
                coins = 10000;
                localStorage.setItem('coins', coins.toString());
                logToGoogleForm('new_login', 10000);
                showFirstLoginCelebration();
            } else {
                logToGoogleForm('user_login', 0);
                coins = parseInt(localStorage.getItem('coins') || '0');
                showNotification('Welcome back, gamer! 🎯');
            }
            
            updateDisplay();
            loadRandomQuestion();
            setupControls();
            startActivityFeed();
            
            // Fetch sheet data every 30 seconds
            fetchUserDataFromSheet();
            setInterval(fetchUserDataFromSheet, 30000);
        }

        // Add CSS animation for falling particles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.addEventListener('DOMContentLoaded', initializeUser);
    </script>
