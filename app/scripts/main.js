!(function(){
	var defaults;
	// $('.resizable').resizable()
	$('.addfield').click(addfield)
	$('.fieldLabel').children().one('focus',clearValue).change(showFieldType)
	$('.fieldType').change(showSelectOptions);
	
	function clearValue(e){
		e.target.value = '';
	}
	
	function showRequire(el, msg){
		console.log(el.value, msg);
	}
	
	function showFieldType(e){
		// showRequire(e.target, 'This is req');
		$('.fieldType').fadeIn();
	}
	function showSelectOptions(e){
		// showRequire(e.target, 'This is req');
		var clone = $('.selectOptions.cloneme').clone()
			clone.removeClass('cloneme').appendTo('.jumbotron p').fadeIn();
	}
	
	
	
	function addfield(){
		var row = $(document.createElement('div'))
			.addClass('row marketing field')
		var labelDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row)
		var label = $(document.createElement('h4'))
			.attr('aria-type','fieldLabel')
			.html($('.fieldLabel').children()[0].value)
			.appendTo(labelDiv)
		var typeDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row)
		var type = $(document.createElement('p'))
			.attr('aria-type','fieldType')
			.html($('.fieldType').children()[0].value)
			.appendTo(typeDiv)
		var soDiv = $(document.createElement('div'))
			.addClass('col-lg-3 resizable')
			.appendTo(row)
		var so = $(document.createElement('p'))
			.attr('aria-type','fieldType')
			.html($('.selectOptions').children()[0].value)
			.appendTo(soDiv)
		row.appendTo('.fieldTable')
	}
	
})()