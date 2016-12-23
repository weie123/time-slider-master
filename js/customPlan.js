/**
 * Created by weie on 2016/12/20.
 */
;(function($,window,document,undefined){
    var pluginName="customPlan";
    var current_time = (new Date("2016-12-19 12:00:00")).getTime();//+ ((new Date("2016-12-19 12:00:00")).getTimezoneOffset() * 60 * 1000 * -1)
    var defaults ={
        dateType:"week",//holiday
        weekRows:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"],
        holidayRows:["假日一","假日二"],
        rulerWidth:'800px',
        timeSliderOption:{
            start_timestamp: current_time - 3600 * 12 * 1000,//当前时间-12小时
            ruler_enable_move:false,
            show_time_cursor:false,
            on_add_timecell_callback:function(){

            }
        },
        weekTimeName:'defalutWeekTimeName'+Math.floor(Math.random()*10000),
        mark:""
    };

    customPlan = function (element,opt) {
        this.options = $.extend({},defaults,opt);
        this.$element = $(element);
        this.currentType = null;
        this.resultObj = {};
        this.init();
        this.bind();
    };

    customPlan.prototype={
        init:function () {
            if(this.options.dateType == "week"){
                this.currentType = this.options.weekRows;

            }else if(this.options.dateType == "holiday" ){
                this.currentType = this.options.holidayRows;
            }
            this.createDom(this.currentType);
        },
        bind:function () {
            var _this=this;
            //清空
            $(_this.$element).find(".clearAll").click(function(){
                for(var i=0;i < _this.currentType.length; i++){
                    $('#'+_this.options.dateType+i).data().timeslider.remove_all_timecells();
                }
            });
            //单行清空&全选
            $(".rowLeft").click(function(){
                var tempId = $(this).next().children()[0].id;
                //已经有了就清空
                if($("#"+tempId).find(".timecell").length > 0){
                    $("#"+tempId).data().timeslider.remove_all_timecells();
                    if(!$(this).hasClass("hasCleared")){
                        $(this).addClass("hasCleared");
                    }else{
                        $(this).removeClass("hasCleared");
                    }
                }else{
                    //todo 全选
                }

            });


        },
        createDom:function(typeArr){
            for(var i=0;i < typeArr.length;i++){
                this.$element.append(
                    "<div class=\"tsc row\">"
                        +"<div class=\"rowLeft\">"+typeArr[i]+"</div>"
                        +"<div class=\"rowRight\">"
                            +"<div id='"+this.options.dateType+i+"' class=\"time-slider\" style='width:"+this.options.rulerWidth+"'></div>"
                        +"</div>"
                    +"</div>"
                );
                $('#'+this.options.dateType+i).TimeSlider(this.options.timeSliderOption);//初始化时间轴
            }
        },
        getdata:function(){
            if(this.options.dateType == "week"){
                var tempWeekObj = {};
                tempWeekObj.weekTimeName = this.options.weekTimeName;
                tempWeekObj.mark = this.options.mark;
                for(var i=0;i < this.options.weekRows.length;i++){
                    var arr = $('#'+this.options.dateType+i).data().timeslider.get_all_timecells();
                    if(i == 0){
                        tempWeekObj.mondayTimeGroup = this.reverseTimeCells(arr);
                    }else if( i == 1){
                        tempWeekObj.tuesdayTimeGroup = this.reverseTimeCells(arr);
                    }else if( i == 2){
                        tempWeekObj.wednessdayTimeGroup  = this.reverseTimeCells(arr);
                    }else if( i == 3){
                        tempWeekObj.thursdayTimeGroup   = this.reverseTimeCells(arr);
                    }else if( i == 4){
                        tempWeekObj.fridayTimeGroup = this.reverseTimeCells(arr);
                    }else if( i == 5){
                        tempWeekObj.saturdayTimeGroup = this.reverseTimeCells(arr);
                    }else if( i == 6){
                        tempWeekObj.sundayTimeGroup = this.reverseTimeCells(arr);
                    }
                }
                return tempWeekObj;
            }else if(this.options.dateType == "holiday"){
                var tempHolidayObj = {};
                for(var i=0;i < this.options.holidayRows.length;i++){
                    var arr = $('#'+this.options.dateType+i).data().timeslider.get_all_timecells();
                    tempHolidayObj[i] = arr;
                }
                return tempHolidayObj;
            }
        },//end getdata
        showdata:function(obj){
            var _this = this;
            for(var i=0;i < _this.currentType.length; i++){
                $('#'+_this.options.dateType+i).data().timeslider.remove_all_timecells();
            }
            var index =0;
            $.each(obj,function(i,item){
                console.log($('#'+_this.options.dateType+i).data());
                $('#'+_this.options.dateType+index++).data().timeslider.displayTimecells(item);
            });
        },
        reverseTimeCells:function(arr){
            var tempResultArr;
            if(arr.length > 0){
                tempResultArr = [];
                for(var j = 0;j<arr.length;j++){
                    var tempObj ={};
                    var tempStart = new Date(arr[j].start);
                    var tempStop = new Date(arr[j].stop);
                    tempStart = ("0"+tempStart.getHours()).substr(-2)+":" + ("0"+tempStart.getMinutes()).substr(-2) +":"+("0"+tempStart.getSeconds()).substr(-2);
                    tempStop = ("0"+tempStop.getHours()).substr(-2)+":" + ("0"+tempStop.getMinutes()).substr(-2) +":"+("0"+tempStop.getSeconds()).substr(-2);
                    tempObj.start = tempStart;
                    tempObj.stop = tempStop;
                    tempResultArr.push(tempObj);
                }
            }else {
                tempResultArr = [];
            }
            return tempResultArr;
        }
    };

    $.fn[pluginName]=function(options){
        //console.log(options);
        this.each(function(){
            if(!$.data(this,"plugin_"+pluginName)){
                $.data(this,"plugin_"+pluginName,new customPlan(this,options));
            }
        });
        return this;
    }
})(jQuery,window,document);