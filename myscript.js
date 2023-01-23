var chart;
$(document).ready(() => {
    $('.choose-timeframe').addClass('hide');
    $('.choose-indicator').addClass('hide');
    $('.choose-buy-conditions').addClass('hide');
    $('.choose-sell-conditions').addClass('hide');
    $('.choose-quantity').addClass('hide');
    $('.choose-trade').addClass('hide');
    
    $.get("https://api.binance.com/api/v1/exchangeInfo", function(data, status){
        data = data.symbols;
        let select_pair = document.getElementsByName('select-pair')[0];
        for(let item of data){
            const node = document.createElement('option');
            node.setAttribute('value', item.symbol);
            node.innerHTML = item.symbol;
            select_pair.appendChild(node);
        }
    })
})
function nav_func(val){
    if(val == 1){
        $('#nav-1').removeClass('active');
        $('#nav-2').removeClass('active');
        $('#nav-3').removeClass('active');
        $('#nav-1').addClass('active');
        
        $('.choose-timeframe').removeClass('show');
        $('.choose-indicator').removeClass('show');
        $('.choose-buy-conditions').removeClass('show');
        $('.choose-sell-conditions').removeClass('show');
        $('.choose-quantity').removeClass('show');
        $('.choose-trade').removeClass('show');
        
        $('.choose-timeframe').addClass('hide');
        $('.choose-indicator').addClass('hide');
        $('.choose-buy-conditions').addClass('hide');
        $('.choose-sell-conditions').addClass('hide');
        $('.choose-quantity').addClass('hide');
        $('.choose-trade').addClass('hide');

        $('.choose-ticker').removeClass('hide');
        $('.choose-ticker').addClass('show');

        $('.create-trade').removeClass('hide');
        $('.create-trade').addClass('show');
        $('.trade-log').removeClass('show');
        $('.trade-log').addClass('hide');
        $('.active-trade').removeClass('show');
        $('.active-trade').addClass('hide');

        document.getElementsByName('trading')[0].innerHTML = 'Place a trade';
    }
    if(val == 2){
        $('#nav-1').removeClass('active');
        $('#nav-2').removeClass('active');
        $('#nav-3').removeClass('active');
        $('#nav-2').addClass('active');

        $('.create-trade').removeClass('show');
        $('.create-trade').addClass('hide');
        $('.trade-log').removeClass('hide');
        $('.trade-log').addClass('show');
        $('.active-trade').removeClass('show');
        $('.active-trade').addClass('hide');
    }
    if(val == 3){
        $('#nav-1').removeClass('active');
        $('#nav-2').removeClass('active');
        $('#nav-3').removeClass('active');
        $('#nav-3').addClass('active');

        $('.create-trade').removeClass('show');
        $('.create-trade').addClass('hide');
        $('.trade-log').removeClass('show');
        $('.trade-log').addClass('hide');
        $('.active-trade').removeClass('hide');
        $('.active-trade').addClass('show');
    }
}

function toNext(val){
    switch(val){
        case 1:
            $('.choose-ticker').addClass('hide');
            $('.choose-timeframe').removeClass('hide');
            $('.choose-timeframe').addClass('show');
            break;
        case 2:
            $('.choose-timeframe').removeClass('show');
            $('.choose-timeframe').addClass('hide');
            $('.choose-indicator').removeClass('hide');
            $('.choose-indicator').addClass('show');

            break;
        case 3:
            if(document.getElementsByName('indicator-length')[0].value === ""){
                $("input[name='indicator-length']").addClass('invalid');
                break;
            }

            $("input[name='indicator-length']").removeClass('invalid');
            $('.choose-indicator').removeClass('show');
            $('.choose-indicator').addClass('hide');
            $('.choose-buy-conditions').removeClass('hide');
            $('.choose-buy-conditions').addClass('show');

            break;
        case 4:
            $('.choose-buy-conditions').removeClass('show');
            $('.choose-buy-conditions').addClass('hide');
            $('.choose-sell-conditions').removeClass('hide');
            $('.choose-sell-conditions').addClass('show');
            
            break;
        case 5:
            if(document.getElementsByName('sell-price')[0].value === ""){
                $("input[name='sell-price']").addClass('invalid');
                break;
            }
            $("input[name='sell-price']").removeClass('invalid');
            $('.choose-sell-conditions').removeClass('show');
            $('.choose-sell-conditions').addClass('hide');
            $('.choose-quantity').removeClass('hide');
            $('.choose-quantity').addClass('show');
            
            break;
        case 6:
            if(document.getElementsByName('quantity-percentage')[0].value === ""){
                $("input[name='quantity-percentage']").addClass('invalid');
                break;
            }
            $("input[name='quantity-percentage']").removeClass('invalid');
            $('.choose-quantity').removeClass('show');
            $('.choose-quantity').addClass('hide');
            $('.choose-trade').removeClass('hide');
            $('.choose-trade').addClass('show');
            
            break;
        case 0:
            $('.choose-trade').removeClass('show');
            $('.choose-trade').addClass('hide');
            $('.choose-ticker').removeClass('hide');
            $('.choose-ticker').addClass('show');
            document.getElementsByName('trading')[0].innerHTML = 'Place a trade';
            break;
    }
}

function showData(data){
    const {pair, timeframe, indicator_length} = data;
    $.get(`https://api.binance.com/api/v3/klines?symbol=${pair}&interval=${timeframe}&limit=100`, function(data, status){
        console.log(data);
        if(chart){
            chart.remove();
        }
        const tmp_data = [];
        for(let item of data){
            let tmp = {
                time: item[0] / 1000,
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
              };
              tmp_data.push(tmp);
        }
        $(".loader").removeClass('show');
        $(".loader").removeClass('hide');
        $(".loader").addClass('hide');

        chart = LightweightCharts.createChart(document.getElementsByClassName('trading-view')[0], { width: 800, height: 400 });

        let data1 = [];
        for(let i = 0; i < tmp_data.length; i ++){
            let tmp = {};
            if(i < indicator_length - 1){
                tmp = {time : tmp_data[i].time, value: tmp_data[i].open};
                data1.push(tmp);
            }
            else{
                let sum = 0;
                for(let j = i - indicator_length + 1; j <= i ; j ++) sum += tmp_data[j].open;
                sum /= indicator_length;
                tmp = {time : tmp_data[i].time, value: sum};
                data1.push(tmp);
            }
        }
        console.log(data1);
        const areaSeries = chart.addLineSeries();
        areaSeries.setData(data1);
        
        const lineSeries = chart.addCandlestickSeries();
        lineSeries.setData(tmp_data);
        chart.timeScale().fitContent();  

    });
}

function created(){

    $(".loader").removeClass('hide');
    $(".loader").addClass('show');
    if (document.getElementsByName('trading')[0].innerHTML == 'Stop')
        document.getElementsByName('trading')[0].innerHTML = 'Place a trade';
    else
        document.getElementsByName('trading')[0].innerHTML = 'Stop';
    const pair = document.getElementsByName('select-pair')[0].value;
    const timeframe = document.getElementsByName('select-timeframe')[0].value;
    const indicator_length = document.getElementsByName('indicator-length')[0].value;
    const indicator_params = document.getElementsByName('indicator-params')[0].value;
    const buy_condition_goes = document.getElementsByName('buy-condition-goes')[0].value;
    const buy_condition_price = document.getElementsByName('buy-condition-price')[0].value;
    const sell_price = document.getElementsByName('sell-price')[0].value;
    const quantity_type = document.getElementsByName('quantity-type')[0].value;
    const quantity_percentage = document.getElementsByName('quantity-percentage')[0].value;
    let data = {
        pair,
        timeframe,
        indicator_length,
        indicator_params,
        buy_condition_goes,
        buy_condition_price,
        sell_price,
        quantity_type,
        quantity_percentage,
    };

    setInterval(() => {
        showData(data)
    }, 1000);
}