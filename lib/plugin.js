require(['gitbook', 'jQuery'], function (gitbook, $) {

	// MEMO:
	// Gitbook is calculated as "calc (100% - 60px)" in the horizontal width when the width of the screen size is 600px
	// or less.
	// In this case, since contradiction occurs in the implementation of this module, return.
	if ($(window).width() <= 600) {
		return;
	}

	var addLoadEvent = function (func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function () {
				if (oldonload) {
					oldonload();
				}
				func();
			}
		}
	}


	var getQueryString = function (name) {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
		var r = window.location.search.substr(1).match(reg)
		if (r != null) return unescape(r[2])
		return null
	}

	var isSingleMode = function () {
		if (getQueryString('single')) {
			return true
		}
		return false
	}
	var setToSingleMode = function () {
		console.log('setToSingleMode  setToSingleMode')
		// 收起导航
		var $book = $('.book')
		if ($book && $book.hasClass('with-summary')) {
			$book.removeClass('with-summary')
		}

		// 隐藏header
		var $header = $('.body-inner .book-header')
		if ($header && !$header.hasClass('hide-single')) {
			$header.addClass('hide-single')
		}

		// 翻页隐藏
		var $navigationPrev = $('.navigation-prev')
		if ($navigationPrev && !$navigationPrev.hasClass('hide-single')) {
			$navigationPrev.addClass('hide-single')
		}
		var $navigationNext = $('.navigation-next')
		if ($navigationNext && !$navigationNext.hasClass('hide-single')) {
			$navigationNext.addClass('hide-single')
		}
	}

	addLoadEvent(function () {
		if (isSingleMode()) {
			setToSingleMode()
		}
	})

	gitbook.events.bind('start', function () {
		if (isSingleMode()) {
			setToSingleMode()
		}
	});

	gitbook.events.bind('page.change', function () {

		var KEY_SPLIT_STATE = 'plugin_gitbook_split';

		var dividerWidth = null;
		var isDraggable = false;
		var dividerCenterOffsetLeft = null;
		var splitState = null;
		var grabPointWidth = null;

		var $body = $('body');
		var $book = $('.book');
		var $summary = $('.book-summary');
		var $bookBody = $('.book-body');
		var $divider = $('<div class="divider-content-summary">' +
			'<div class="divider-content-summary__icon">' +
			'<i class="fa fa-ellipsis-v"></i>' +
			'</div>' +
			'</div>');

		$summary.append($divider);

		dividerWidth = $divider.outerWidth();
		dividerCenterOffsetLeft = $divider.outerWidth() / 2;

		// restore split state from sessionStorage
		splitState = getSplitState();
		setSplitState(
			splitState.summaryWidth,
			splitState.summaryOffset,
			splitState.bookBodyOffset
		);

		setTimeout(function () {
			if (isSingleMode()) {
				setToSingleMode()
			}

			var isGreaterThanEqualGitbookV2_5 = !Boolean($('.toggle-summary').length);

			var $toggleSummary = isGreaterThanEqualGitbookV2_5 ?
				$('.fa.fa-align-justify').parent() : $('.toggle-summary');

			$toggleSummary.on('click', function () {

				var summaryOffset = null;
				var bookBodyOffset = null;

				var isOpen = isGreaterThanEqualGitbookV2_5 ?
					!gitbook.sidebar.isOpen() : $book.hasClass('with-summary');

				if (isOpen) {
					summaryOffset = -($summary.outerWidth());
					bookBodyOffset = 0;
				} else {
					summaryOffset = 0;
					bookBodyOffset = $summary.outerWidth();
				}

				setSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
				saveSplitState($summary.outerWidth(), summaryOffset, bookBodyOffset);
			});
		}, 1);

		$divider.on('mousedown', function (event) {
			event.stopPropagation();
			isDraggable = true;
			grabPointWidth = $summary.outerWidth() - event.pageX;
		});

		$body.on('mouseup', function (event) {
			event.stopPropagation();
			isDraggable = false;
			saveSplitState(
				$summary.outerWidth(),
				$summary.position().left,
				$bookBody.position().left
			);
		});

		$body.on('mousemove', function (event) {
			if (!isDraggable) {
				return;
			}
			event.stopPropagation();
			event.preventDefault();
			$summary.outerWidth(event.pageX + grabPointWidth);
			$bookBody.offset({
				left: event.pageX + grabPointWidth
			});
		});

		function getSplitState() {
			var splitState = JSON.parse(sessionStorage.getItem(KEY_SPLIT_STATE));
			splitState || (splitState = {});
			splitState.summaryWidth || (splitState.summaryWidth = $summary.outerWidth());
			splitState.summaryOffset || (splitState.summaryOffset = $summary.position().left);
			splitState.bookBodyOffset || (splitState.bookBodyOffset = $bookBody.position().left);
			return splitState;
		}

		function saveSplitState(summaryWidth, summaryWidthOffset, bookBodyOffset) {
			sessionStorage.setItem(KEY_SPLIT_STATE, JSON.stringify({
				summaryWidth: summaryWidth,
				summaryOffset: summaryWidthOffset,
				bookBodyOffset: bookBodyOffset,
			}));
		}

		function setSplitState(summaryWidth, summaryOffset, bookBodyOffset) {
			$summary.outerWidth(summaryWidth);
			$summary.offset({
				left: summaryOffset
			});
			$bookBody.offset({
				left: bookBodyOffset
			});
			// improved broken layout in windows chrome.
			//   "$(x).offset" automatically add to "position:relative".
			//   but it cause layout broken..
			$summary.css({
				position: 'absolute'
			});
			$bookBody.css({
				position: 'absolute'
			});
		}
	});
});