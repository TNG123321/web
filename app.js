const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_Player'
const playlist = $('.playlist')
const heading = $('header h2')
const cdThumd = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const btnRandom = $('.btn-random')
const repeatBtn = $('.btn-repeat')
// console.log(playBtn)
const app = {
    currentIndex:0,
    isPlaying:false,
    isRandom: false,
    isRepeat: false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
    songs: [
        {
            name: 'Em Đồng ý(I Do)',
            singer: "Đức phúc,911",
            path:'./accset/music/EmDongY.mp3',
            image:'./accset/img/img1.jpg'
        },
        {
            name: 'Bật Tình yêu Lên',
            singer: "Tăng Duy Tân, Hòa MinZy",
            path:'./accset/music/BatTinhYeuLen.mp3',
            image:'./accset/img/img2.jpg'
        },
        {
            name: 'Nếu lúc đó',
            singer: "tlinh,2pillz",
            path:'./accset/music/NeuLucDo.mp3',
            image:'./accset/img/img3.jpg'
        },
        {
            name: 'Ghẹ Iu Dấu Của Em Ơi',
            singer: "tlinh,2pillz,Wokeup",
            path:'./accset/music/GheIuDauCuaEmOi.mp3',
            image:'./accset/img/img4.jpg'
        },
        {
            name: '11:11',
            singer: "MiiNa (DREAMeR), RIN9, DREAMeR",
            path:'./accset/music/1111.mp3',
            image:'./accset/img/img5.jpg'
        },
        {
            name: 'Người Rất Tốt Không Gặp Sẽ Tốt Hơn ',
            singer: "Hiền Hồ",
            path:'./accset/music/NguoiRatTotKhongGapSeTotHon.mp3',
            image:'./accset/img/img6.jpg'
        },
        {
            name: 'Cô Gái Này Là Của Ai?',
            singer: "KxR, Nhi Nhi",
            path:'./accset/music/CoGaiNayLaCuaAi.mp3',
            image:'./accset/img/img7.jpg'
        },
        {
            name: 'Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau ',
            singer: "O.lew",
            path:'./accset/music/RoiTaSeNgamPhaoHoaCungNhau.mp3',
            image:'./accset/img/img8.jpg'
        },
        {
            name: 'Bo Xì Bo ',
            singer: "Hoàng Thùy Linh",
            path:'./accset/music/BoXiBo.mp3',
            image:'./accset/img/img9.jpg'
        },
        {
            name: 'Để Tôi Ôm Em Bằng Giai Điệu Này ',
            singer: "Kai Đinh, MIN, GREY D",
            path:'./accset/music/DeToiOmEmBangGiaiDieuNay.mp3',
            image:'./accset/img/img10.jpg'
        },
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))


    },
    render: function(){
        const htmls=this.songs.map((song,index)=>{
            return `
            <div class="song ${index ===this.currentIndex?'active': ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                 </div>
          </div>
            `;
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth
        //Xử lý CD quay và dừng
        const cdthumdAnimate = cdThumd.animate([
            {transform: 'rotate(360deg)'}
        ], {
                duration: 10000,
                iterations: Infinity
            })

        cdthumdAnimate.pause()
        //xu ly phong to thu nho cd
        document.onscroll = function(){
            // console.log(Math.floor(window.scrollY))
            const scrollTop =document.documentElement.scrollTop
            const newCdWidth = cdWidth-scrollTop;
            cd.style.width = newCdWidth > 0 ?newCdWidth + 'px':0;
            cd.style.opacity = newCdWidth/cdWidth
        }
        //xu ly click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }else{
                audio.play()
            }
        }
        
        audio.onplay = function() {
            _this.isPlaying = true
            cdthumdAnimate.play()
            player.classList.add('playing')    
        }

        audio.onpause = function() {
            _this.isPlaying = false
            cdthumdAnimate.pause()
            player.classList.remove('playing')    
        }

        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime/audio.duration*100)
                progress.value = progressPercent
            }
                // console.log(audio.currentTime/audio.duration*100)
        }

        progress.onchange = function(e){
            const seekTime = audio.duration/100 * e.target.value
            audio.currentTime = seekTime
        }

        //xu ly click vao nut next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //xu ly click vao nut prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        btnRandom.onclick = function(e){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRamdom', _this.isRandom)
            btnRandom.classList.toggle('active',_this.isRandom)

        }
        //xu ly net song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.click();
            }
        }
        //xu ly phat lai mot bai hat
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat 
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        //lang nghe hanh vi click playlist
        playlist.onclick = function(e){
            const songNode =e.target.closest(".song:not(.active)"); 
            
            if(songNode || e.target.closest('.option') ){
                //xu ly khi click vao song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()

                }
                //xu ly khi click vao option
                if(!e.target.closest('.option')){

                }

            }

        }
      },
    // getCurrentSong: function(){
    //     return this.songs[this.currentIndex]
    // },
    scrollToActiveSong: function(){
        setTimeout(function(){
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'end',
                inline:'nearest'
            })
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumd.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        // console.log(cdThumd)

    },
    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex>=this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()

    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex<0){
            this.currentIndex = this.songs.length-1
        }
        this.loadCurrentSong()

    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
            // console.log(Math.floor(Math.random() * this.songs.length))

        }while(newIndex===this.currentIndex);
        
        this.currentIndex = newIndex
        this.loadCurrentSong()

    },
    start: function(){
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()

        this.render()

        btnRandom.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)


    }
}
app.start()