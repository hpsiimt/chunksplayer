// Requires JQuery 1.10.2 or Higher

var ChunkPlayerV2 = function(canvas_id,video_arr
    ,config = {}){
    
    this.config = {
        log_open : true,
        canvas_height:768,
        canvas_witdh:1366,
        css_height:360,
        css_witdh:650,
        controls:true,
        controls_height:45,
    };
    
    this.canvas_id = canvas_id;
    this.canvas_obj = $("#"+canvas_id);
    this.ctx = this.canvas_obj[0].getContext("2d");
    this.videoArr = video_arr;
    
    this.log_open = null;
    
    this.current_video_obj = null;
    this.next_video_obj = null;
    
    this.current_index = 0;
    this.next_index = 0;
    this.last_index = (video_arr.length - 1);
    
    this.one_chunk_time = 10; //Sec
    
    this.current_interval = null;
    
    this.video_playing = false;
    this.video_paused = true;
    
    this.next_slot_available = true;
    
    this.isfullScreen = false;
    
    this.canvas_div_cls = "chunkPlayer";
    this.canvas_div_id = "chunkPlayer_"+canvas_id;
    
    this.canvas_selector = "#"+this.canvas_div_id + " ";
    
    
    this.controls_div_id = "chunkControls";
    this.controls_btn_cls = "control_btn";
    this.controls_bkw_cls = "bkd_btn";
    this.controls_fwd_cls = "fwd_btn";
    this.controls_btns_id = {
        bkd_1h:{id:"bkd_1h",text:"1H",title:" Backword 1 Hour"},
        bkd_30m:{id:"bkd_30m",text:"30M",title:"Backword 30 Min"},
        bkd_10m:{id:"bkd_10m",text:"10M",title:"Backword 10 Min"},
        bkd_5m:{id:"bkd_5m",text:"5M",title:"Backword 5 Min"},
        bkd_1m:{id:"bkd_1m",text:"1M",title:"Backword 1 Min"},
        fwd_1h:{id:"fwd_1h",text:"1H",title:"Forword 1 Hour"},
        fwd_30m:{id:"fwd_30m",text:"30M",title:"Forword 30 Min"},
        fwd_10m:{id:"fwd_10m",text:"10M",title:"Forword 10 Min"},
        fwd_5m:{id:"fwd_5m",text:"5M",title:"Forword 5 Min"},
        fwd_1m:{id:"fwd_1m",text:"1M",title:"Forword 1 Min"},
        to_strt:{id:"to_strt",text:"",title:"From the Start"},
        full_s:{id:"full_s",text:"",title:"Full Screen"},
        play:{id:"play",text:"",title:"Play",},
        pause:{id:"pause",text:"",title:"Pause"},
    };
    
    var self = this;
    this.player_controls = function(){
        
        let controlerDiv = $("<div><div>");
        
        
        controlerDiv.addClass(self.controls_div_id);
        if(!self.config.controls)
            controlerDiv.css("display","none");
        
        
        
        let to_strt = $("<button></button>");
        to_strt.attr("class",self.controls_btn_cls);
        to_strt.addClass(self.controls_btns_id.to_strt.id);
        to_strt.attr("title",self.controls_btns_id.to_strt.title);
        to_strt.html(self.controls_btns_id.to_strt.text);
        controlerDiv.append(to_strt);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.to_strt.id,function(){
            self.jump_time.TO_START();
        });
        
        let bkd_1h = $("<button></button>");
        bkd_1h.attr("class",self.controls_btn_cls + " "+ self.controls_bkw_cls);
        bkd_1h.addClass(self.controls_btns_id.bkd_1h.id);
        bkd_1h.attr("title",self.controls_btns_id.bkd_1h.title);
        bkd_1h.html(self.controls_btns_id.bkd_1h.text);
        controlerDiv.append(bkd_1h);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.bkd_1h.id,function(){
            self.jump_time.BKD_ONE_HOUR();
        });
        
        let bkd_30m = $("<button></button>");
        bkd_30m.attr("class",self.controls_btn_cls + " "+ self.controls_bkw_cls);
        bkd_30m.addClass(self.controls_btns_id.bkd_30m.id);
        bkd_30m.attr("title",self.controls_btns_id.bkd_30m.title);
        bkd_30m.html(self.controls_btns_id.bkd_30m.text);
        controlerDiv.append(bkd_30m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.bkd_30m.id,function(){
            self.jump_time.BKD_30_MIN();
        });
        
        let bkd_10m = $("<button></button>");
        bkd_10m.attr("class",self.controls_btn_cls + " "+ self.controls_bkw_cls);
        bkd_10m.addClass(self.controls_btns_id.bkd_10m.id);
        bkd_10m.attr("title",self.controls_btns_id.bkd_10m.title);
        bkd_10m.html(self.controls_btns_id.bkd_10m.text);
        controlerDiv.append(bkd_10m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.bkd_10m.id,function(){
            self.jump_time.BKD_TEN_MIN();
        });
        
        let bkd_5m = $("<button></button>");
        bkd_5m.attr("class",self.controls_btn_cls + " "+ self.controls_bkw_cls);
        bkd_5m.addClass(self.controls_btns_id.bkd_5m.id);
        bkd_5m.attr("title",self.controls_btns_id.bkd_5m.title);
        bkd_5m.html(self.controls_btns_id.bkd_5m.text);
        controlerDiv.append(bkd_5m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.bkd_5m.id,function(){
            self.jump_time.BKD_FIVE_MIN();
        });
        
        let bkd_1m = $("<button></button>");
        bkd_1m.attr("class",self.controls_btn_cls + " "+ self.controls_bkw_cls);
        bkd_1m.addClass(self.controls_btns_id.bkd_1m.id);
        bkd_1m.attr("title",self.controls_btns_id.bkd_1m.title);
        bkd_1m.html(self.controls_btns_id.bkd_1m.text);
        controlerDiv.append(bkd_1m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.bkd_1m.id,function(){
            self.jump_time.BKD_ONE_MIN();
        });
        
        let play = $("<button></button>");
        play.attr("class",self.controls_btn_cls);
        play.addClass(self.controls_btns_id.play.id);
        play.attr("title",self.controls_btns_id.play.title);
        play.html(self.controls_btns_id.play.text);
        controlerDiv.append(play);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.play.id,function(){
            self.play();
        });
        
        let pause = $("<button></button>");
        pause.attr("class",self.controls_btn_cls);
        pause.addClass(self.controls_btns_id.pause.id);
        pause.attr("title",self.controls_btns_id.pause.title);
        pause.html(self.controls_btns_id.pause.text);
        controlerDiv.append(pause);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.pause.id,function(){
            self.pause();
        });
        
        let fwd_1m = $("<button></button>");
        fwd_1m.attr("class",self.controls_btn_cls + " " + self.controls_fwd_cls);
        fwd_1m.addClass(self.controls_btns_id.fwd_1m.id);
        fwd_1m.attr("title",self.controls_btns_id.fwd_1m.title);
        fwd_1m.html(self.controls_btns_id.fwd_1m.text);
        controlerDiv.append(fwd_1m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.fwd_1m.id,function(){
            self.jump_time.FWD_ONE_MIN();
        });
        
        let fwd_5m = $("<button></button>");
        fwd_5m.attr("class",self.controls_btn_cls + " " + self.controls_fwd_cls);
        fwd_5m.addClass(self.controls_btns_id.fwd_5m.id);
        fwd_5m.attr("title",self.controls_btns_id.fwd_5m.title);
        fwd_5m.html(self.controls_btns_id.fwd_5m.text);
        controlerDiv.append(fwd_5m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.fwd_5m.id,function(){
            self.jump_time.FWD_FIVE_MIN();
        });
        
        let fwd_10m = $("<button></button>");
        fwd_10m.attr("class",self.controls_btn_cls + " " + self.controls_fwd_cls);
        fwd_10m.addClass(self.controls_btns_id.fwd_10m.id);
        fwd_10m.attr("title",self.controls_btns_id.fwd_10m.title);
        fwd_10m.html(self.controls_btns_id.fwd_10m.text);
        controlerDiv.append(fwd_10m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.fwd_10m.id,function(){
            self.jump_time.FWD_TEN_MIN();
        });
        
        let fwd_30m = $("<button></button>");
        fwd_30m.attr("class",self.controls_btn_cls + " " + self.controls_fwd_cls);
        fwd_30m.addClass(self.controls_btns_id.fwd_30m.id);
        fwd_30m.attr("title",self.controls_btns_id.fwd_30m.title);
        fwd_30m.html(self.controls_btns_id.fwd_30m.text);
        controlerDiv.append(fwd_30m);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.fwd_30m.id,function(){
            self.jump_time.FWD_30_MIN();
        });
        
        
        let fwd_1h = $("<button></button>");
        fwd_1h.attr("class",self.controls_btn_cls + " " + self.controls_fwd_cls);
        fwd_1h.addClass(self.controls_btns_id.fwd_1h.id);
        fwd_1h.attr("title",self.controls_btns_id.fwd_1h.title);
        fwd_1h.html(self.controls_btns_id.fwd_1h.text);
        controlerDiv.append(fwd_1h);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.fwd_1h.id,function(){
            self.jump_time.FWD_ONE_HOUR();
        });
        
        let full_s = $("<button></button>");
        full_s.attr("class",self.controls_btn_cls);
        full_s.addClass(self.controls_btns_id.full_s.id);
        full_s.attr("title",self.controls_btns_id.full_s.title);
        full_s.html(self.controls_btns_id.full_s.text);
        controlerDiv.append(full_s);
        $(document).on("click",self.canvas_selector+"."+self.controls_btns_id.full_s.id,function(){
            self.fullScreen();
        });
        
        
        
        return controlerDiv;
    }
    this.set_config = function(conf){
        if('log_open' in conf)
            self.config.log_open = conf.log_open;
        if('canvas_height' in conf)
            self.config.canvas_height = conf.canvas_height;
        if('canvas_witdh' in conf)
            self.config.canvas_witdh = conf.canvas_witdh;
        if('css_height' in conf)
            self.config.canvas_height = conf.css_height;
        if('css_witdh' in conf)
            self.config.canvas_witdh = conf.css_witdh;
        if('controls' in conf)
            self.config.controls = conf.controls;
        
        
        self.log_open  = self.config.log_open;
        
        
        let canvas_div = $("<div></div>");
        canvas_div.attr("id",self.canvas_div_id);
        canvas_div.attr("class",self.canvas_div_cls);
        
        
        canvas_div.css("max-height",self.config.css_height);
        canvas_div.css("max-width",self.config.css_witdh);
        
        self.canvas_obj.attr("height",self.config.canvas_height);
        self.canvas_obj.attr("width",self.config.canvas_witdh);
        self.canvas_obj.css("max-height","100%");
        self.canvas_obj.css("max-width","100%");
        self.canvas_obj.css("position","initial");
        
        self.canvas_obj.attr("title","Double Click to Enter Full Screen");
        
        self.canvas_obj.on("dblclick",function(){
            self.fullScreen();
        });
        
        
//        canvas_div.append(self.player_controls());
        self.canvas_obj.wrap(canvas_div);
        
        var canvas_div_real = $("#"+self.canvas_div_id);
        canvas_div_real.append(self.player_controls());
        
        
    }
    this.set_config(config);
    
    
    this.create_next_video = function(){
        if(!self.next_slot_available)
            return;
        
        self.next_slot_available = false;
        if(self.videoArr.length == self.next_index){
            self.log("Video Array End");
           return false; 
        }
        self.log("Creating Video tag"+ self.next_index);    
        let video_tag = $("<video></video>");
        
        video_tag.attr("src", self.videoArr[self.next_index]);
        video_tag.on("play", function() {
            self.log("Play event");
            self.current_interval = window.setInterval(function() {
                self.ctx.drawImage(video_tag[0], 0, 0, self.config.canvas_witdh, self.config.canvas_height);
               
            }, 20);
            
            
        });
        video_tag.on("pause", function() {
            self.log("Pause event");
            window.clearInterval(self.current_interval);
        });
        
        if(self.isPaused() && self.current_index == 0){
            video_tag.on("loadeddata",function(){
                self.ctx.drawImage(video_tag[0], 0, 0, self.config.canvas_witdh, self.config.canvas_height);
            });
        }
        
        video_tag.on("ended", self.swapAndPlay);
        video_tag.on("timeupdate",function(){self.trackTime(this)});
        
        self.log("Next Tag Created"+self.next_index);
        self.next_video_obj = video_tag;
        
    }
    
    this.control_prop = {
        play_x :self.config.canvas_witdh/2,
        play_y :self.config.canvas_height+(self.config.controls_height/2),
        play_r :15,
    }
    
    
    
    this.swapAndPlay = function(play = true){
        if(self.current_interval){
            window.clearInterval(self.current_interval);
        }
        
        
        
        if (self.current_video_obj !== null && !self.current_video_obj.paused) 
            self.current_video_obj[0].pause();
        
        if(self.videoArr.length == self.next_index){
            self.pause();
            self.log("Going into pause state");
            if(self.isfullScreen)
                self.fullScreen();
           return false; 
        }
        self.log("Tryng to Swap Video");
        let temp_obj = self.current_video_obj;
        self.current_video_obj = self.next_video_obj;
        
        self.current_index = self.next_index;
        self.next_index++;
        self.next_slot_available = true;
        if(play){
            self.current_video_obj[0].play();
            self.log("Playing Video"+self.current_index);
            self.video_playing = true;
            self.video_paused = false;
        }
        
        
        
        if(temp_obj !== null){
            self.log("Removing Old Tag");
            temp_obj.remove();
        }
        
    }
    
    
    this.trackTime = function(v_this){
        var currentTime = v_this.currentTime;
        var duration = v_this.duration;
        var percent = (currentTime/duration)*100;
        if(percent > 80){
            self.create_next_video();
        }
    }
    
    
    this.goToStream = function(index){
        self.next_index = index;
        self.next_slot_available = true;
        self.create_next_video();
        self.swapAndPlay();
    }
    
    
    this.jump_time = { 
        
        //Start
        TO_START:       function(){
                            return self.jump_check(0)
                        },
        
        // go forword
        FWD_ONE_MIN:    function(){
                            return self.jump_check(60/self.one_chunk_time)
                        },
        FWD_FIVE_MIN:   function(){
                            return self.jump_check((60*5)/self.one_chunk_time)
                        },
        FWD_TEN_MIN:    function(){
                            return self.jump_check((60*10)/self.one_chunk_time)
                        },
        FWD_30_MIN:     function(){
                            return self.jump_check((60*30)/self.one_chunk_time)
                        },
        FWD_ONE_HOUR:   function(){
                            return self.jump_check((60*60)/self.one_chunk_time)
                        },
        // go Backword
        BKD_ONE_MIN:    function(){
                            return self.jump_check(-(60/self.one_chunk_time))
                        },
        BKD_FIVE_MIN:   function(){
                            return self.jump_check(-((60*5)/self.one_chunk_time))
                        },
        BKD_TEN_MIN:    function(){
                            return self.jump_check(-((60*10)/self.one_chunk_time))
                        },
        BKD_30_MIN:     function(){
                            return self.jump_check(-((60*30)/self.one_chunk_time))
                        },
        BKD_ONE_HOUR:   function(){
                            return self.jump_check(-((60*60)/self.one_chunk_time))
                        },
    };
    
    this.jump_check = function(index){
        
        if(index == 0){
            this.goToStream(0);
            msg = "Starting Stream...";
            return {status:true,msg:msg};
        }
        
        var now_index = this.current_index;
        this.log("Now Index:"+now_index);
        var new_index = now_index + index;
        var msg = "";
        if(new_index < 0 || new_index > this.last_index){
            msg = "Cannot Go Further";
            this.log(msg);
            return {status:false,msg:msg};
        }else{
            this.goToStream(new_index);
            msg = "Starting Stream...";
            return {status:true,msg:msg};
        }
    }
    
    this.showControls = function(){
        self.config.controls = true;
        $(self.canvas_selector+ "."+self.controls_div_id).show();
    }
    this.hideControls = function(){
        self.config.controls = false;
        $(self.canvas_selector+ "."+self.controls_div_id).hide();
    }
    
    this.appendVideo = function(url,playNow = true){
        self.videoArr.push(url);
        self.last_index++;
        if(self.video_paused == true && playNow == true){
            this.goToStream(self.videoArr.length-1);
        }
    }
    
    
    this.play = function(){
        if(self.video_paused){
            self.video_paused = false;
            self.video_playing = true;
            self.current_video_obj[0].play();
            $(self.canvas_selector+ "."+self.controls_btns_id.play.id ).hide();
            $(self.canvas_selector+ "."+self.controls_btns_id.pause.id ).show();
            
            $(self.canvas_selector+ "."+self.controls_div_id ).hover(function(){$(this).css("opacity",1);},function(){$(this).css("opacity",0);});
            
             self.log("Playing Video"+self.current_index);
        }
    }
    this.pause = function(){
        if(self.video_playing){
            self.video_paused = true;
            self.video_playing = false;
            self.current_video_obj[0].pause();
            $(self.canvas_selector+ "."+self.controls_btns_id.play.id ).show();
            $(self.canvas_selector+ "."+self.controls_btns_id.pause.id ).hide();
            
            $(self.canvas_selector+ "."+self.controls_div_id ).hover(function(){$(this).css("opacity",1);},function(){$(this).css("opacity",1);});

            self.log("PausingVideo"+self.current_index);
        }
    }
    this.isPlaying = function(){
        return self.video_playing;
    }
    this.isPaused = function(){
        return self.video_paused;
    }
    this.fullScreen = function(){
        
        if(self.isfullScreen == false){
            var el = document.getElementById(self.canvas_div_id );
 
            if (el.requestFullscreen) {
                el.requestFullscreen();
            } else if (el.mozRequestFullScreen) { /* Firefox */
              el.mozRequestFullScreen();
            } else if (el.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
              el.webkitRequestFullscreen();
            } else if (el.msRequestFullscreen) { /* IE/Edge */
              el.msRequestFullscreen();
            }
            self.isfullScreen = true;
            self.canvas_obj.attr("title","Double Click to Exit Full Screen");
            $(self.canvas_selector+"."+self.controls_btns_id.full_s.id).attr("title","Exit Full Screen");
        }else{
            if (document.exitFullscreen) {
                document.exitFullscreen();
              } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
              } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
              } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
              }
            self.isfullScreen = false;
            self.canvas_obj.attr("title","Double Click to Enter Full Screen");
            $(self.canvas_selector+"."+self.controls_btns_id.full_s.id).attr("title","Full Screen");
        }
            
    }
    
    this.destroy = function(){
        if (self.current_video_obj !== null && !self.current_video_obj.paused) 
                self.current_video_obj[0].pause();
        if(self.current_interval){
            window.clearInterval(self.current_interval);
        }
        self.current_video_obj.remove();
        self.log("destroyed");
        return true;
    }
    this.log = function(msg){
        if(self.log_open == true)
        console.log(msg);
    }
    
    this.create_next_video();
    this.swapAndPlay(false);
    $(self.canvas_selector+ "."+self.controls_btns_id.pause.id ).hide();
    
    
    
    
}