/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/InvisibleText","sap/ui/core/Element","sap/ui/core/Control","sap/ui/core/ListItem","sap/ui/core/library","sap/ui/core/Renderer","sap/ui/core/message/MessageMixin","sap/m/DynamicDateFormat","sap/m/DynamicDateUtil","sap/ui/core/IconPool","sap/ui/core/LabelEnablement","sap/ui/core/format/DateFormat","sap/ui/base/ManagedObjectObserver","sap/ui/Device","./Label","./GroupHeaderListItem","./StandardListItem","./StandardListItemRenderer","./Button","./List","./Input","./InputRenderer","./Toolbar","./ResponsivePopover","./Page","./NavContainer","./DynamicDateRangeRenderer","./StandardDynamicDateOption","./StandardDynamicDateRangeKeys","sap/ui/dom/jquery/Focusable","./library"],function(t,e,o,i,a,n,s,r,p,u,l,h,g,d,_,f,c,y,v,m,I,D,b,C,P,O,V,A,L,T,R){"use strict";var N=a.ValueState,F=R.ToolbarDesign,S=R.ToolbarStyle,E=R.ListType,x=R.ListMode,B=R.ListSeparators,w=sap.ui.getCore().getLibraryResourceBundle("sap.m");var H=o.extend("sap.m.DynamicDateRange",{metadata:{library:"sap.m",properties:{value:{type:"object"},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},valueState:{type:"sap.ui.core.ValueState",group:"Appearance",defaultValue:N.None},name:{type:"string",group:"Misc",defaultValue:null},placeholder:{type:"string",group:"Misc",defaultValue:null},editable:{type:"boolean",group:"Behavior",defaultValue:true},valueStateText:{type:"string",group:"Misc",defaultValue:null},required:{type:"boolean",group:"Misc",defaultValue:false},enableGroupHeaders:{type:"boolean",group:"Behavior",defaultValue:true},formatter:{type:"object"},options:{type:"string[]",group:"Behavior",defaultValue:[]}},aggregations:{_input:{type:"sap.m.Input",multiple:false,visibility:"hidden"},_popup:{type:"sap.m.ResponsivePopover",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{change:{parameters:{value:{type:"object"},valid:{type:"boolean"}}}}},renderer:V});s.call(H.prototype);H.prototype.init=function(){this._oInput=new U(this.getId()+"-input",{showValueHelp:true,valueHelpIconSrc:u.getIconURI("sap-icon://check-availability"),valueHelpRequest:this._toggleOpen.bind(this),showSuggestion:true,suggest:this._handleSuggest.bind(this)});this._oListItemDelegate=undefined;this._onBeforeInputRenderingDelegate={onBeforeRendering:function(){this._oInput._getValueHelpIcon().setVisible(true)}};this._oInput._getValueHelpIcon().setTooltip(w.getText("INPUT_VALUEHELP_BUTTON"));this._oInput.addDelegate(this._onBeforeInputRenderingDelegate,this);this.setAggregation("_input",this._oInput,false);this._oInput._setControlOrigin(this);this._oInput.attachChange(this._handleInputChange,this);this.oValueObserver=new g(function(){delete this.oBoundValueFormatter}.bind(this));this.oValueObserver.observe(this,{bindings:["value"]})};H.prototype.exit=function(){this._oInput.removeDelegate(this._onBeforeInputRenderingDelegate);this._onBeforeInputRenderingDelegate=undefined;this.oValueObserver.destroy();this._infoDatesFooter=undefined;this.aInputControls=undefined;this._removeAllListItemDelegates()};H.prototype._removeAllListItemDelegates=function(){if(this._oOptionsList){this._oOptionsList.getItems().forEach(function(t){t.removeDelegate(this._oListItemDelegate)},this)}};H.prototype.onBeforeRendering=function(){this._updateInputValue(this.getValue());this._oInput.setEditable(this.getEditable());this._oInput.setEnabled(this.getEnabled());this._oInput.setRequired(this.getRequired());this._oInput.setName(this.getName());this._oInput.setWidth(this.getWidth());this._oInput.setPlaceholder(this.getPlaceholder());this._oInput.setValueState(this.getValueState());this._oInput.setValueStateText(this.getValueStateText())};H.prototype.setValue=function(t){t=this._substitudeValue(t);this.setProperty("value",t);this._updateInputValue(t);return this};H.prototype._toggleOpen=function(){if(this._oPopup&&this._oPopup.isOpen()){this._closePopup()}else{this.open()}};H.prototype.open=function(){if(this.getEditable()&&this.getEnabled()){this._createPopup();this._createPopupContent();if(!this._oListItemDelegate){this._oListItemDelegate={onsapshow:this._closePopup.bind(this),onsaphide:this._closePopup.bind(this)}}this._removeAllListItemDelegates();this._oOptionsList.destroyAggregation("items");this._createValueHelpItems().forEach(function(t){t.addDelegate(this._oListItemDelegate,this);this._oOptionsList.addItem(t)},this);this._oNavContainer.to(this._oNavContainer.getPages()[0]);this._openPopup()}};H.prototype.addOption=function(t){var e=this.getOptions();if(e.indexOf(t)===-1){e.push(t)}this.setOptions(e)};H.prototype._updateInputValue=function(t){var e;if(t&&t.operator!=="PARSEERROR"){e=this._enhanceInputValue(this._formatValue(t),t);this._oInput.setValue(e)}};H.prototype._handleSuggest=function(t){if(this._oPopup&&this._oPopup.isOpen()){this._closePopup()}var e=t.getParameter("suggestValue");this._oInput.removeAllSuggestionItems();var o=this._getOptions().filter(function(t){var o={operator:t.getKey(),values:[]},i=t.getValueHelpUITypes(this);if(i.length&&i[0].getType()){return false}var a=p.getOption(o.operator).format(o,this._getFormatter()).toLowerCase();var n=a.indexOf(e.toLowerCase());return n===0||n>0&&a[n-1]===" "},this);o.forEach(function(t){var e={operator:t.getKey(),values:[]};this._addSuggestionItem(e)},this);var i=e.match(/\d+/);if(!i){return}o=this._getOptions().filter(function(t){return t.getValueHelpUITypes(this).length===1&&t.getValueHelpUITypes(this)[0].getType()==="int"},this);o.forEach(function(t){var e={operator:t.getKey(),values:[parseInt(i[0])]};this._addSuggestionItem(e)},this)};H.prototype._getOptions=function(){var t=this.getOptions();var e=t.map(function(t){return p.getOption(t)},this);return e.filter(function(t){return!!t})};H.prototype._getDatesLabelFormatter=function(){if(!this._oDatesLabelFormatter){var t=Object.create(this._getFormatter()._dateFormatter.oFormatOptions);t.interval=true;this._oDatesLabelFormatter=h.getInstance(t)}return this._oDatesLabelFormatter};H.prototype._destroyInputControls=function(){if(!this.aInputControls){return}this.aInputControls.forEach(function(t){t.destroy()});this.aInputControls=undefined};H.prototype._addSuggestionItem=function(t){var e=p.toDates(t);var o=new i({text:p.getOption(t.operator).format(t,this._getFormatter()),additionalText:this._getDatesLabelFormatter().format(e)});this._oInput.addSuggestionItem(o)};H.prototype._handleInputChange=function(t){var e=t.getParameter("value");var o=this._parseValue(this._stripValue(e));var i=this.getValue();var a=e.trim()===""||!!o;if(!a){this.setValue({operator:"PARSEERROR",values:[w.getText("DDR_WRONG_VALUE"),e]})}else{this.setValue(o)}this.fireChange({value:this.getValue(),prevValue:i,valid:a})};H.prototype._enhanceInputValue=function(t,e){if(p.getOption(e.operator).enhanceFormattedValue()||e.operator==="LASTDAYS"&&e.values[0]<=1||e.operator==="NEXTDAYS"&&e.values[0]<=1){return t+" ("+this._toDatesString(e)+")"}return t};H.prototype._stripValue=function(t){var e=t.indexOf("(");var o=t.lastIndexOf(")");var i=t;if(e!==-1&&o!==-1&&e<o){i=t.slice(0,e)+t.slice(o+1);i=i.trim()}return i};H.prototype._toDatesString=function(t){return this._getDatesLabelFormatter().format(p.toDates(t))};H.prototype._createPopup=function(){if(!this._oPopup){this._oPopup=new C(this.getId()+"-RP",{contentHeight:"470px",contentWidth:Y(this.getDomRef())?"272px":"320px",showCloseButton:false,showArrow:false,showHeader:false,placement:R.PlacementType.VerticalPreferedBottom,ariaLabelledBy:[t.getStaticId("sap.m","INPUT_AVALIABLE_VALUES")]});this._oPopup.addStyleClass("sapMDDRPopover");if(d.system.phone){this._oPopup.addStyleClass("sapUiNoContentPadding")}else{this._oPopup._oControl._getSingleNavContent=function(){return null}}this._oPopup.attachAfterOpen(function(){var t=this._oNavContainer.getPages()[0];this._applyNavContainerPageFocus(t);this.invalidate()},this);this._oPopup.attachAfterClose(function(){this._setFooterVisibility(false);this.invalidate();this.getAggregation("_input").focus()},this);this._oPopup.setBeginButton(new v({type:R.ButtonType.Emphasized,text:w.getText("DYNAMIC_DATE_RANGE_CONFIRM"),press:this._applyValue.bind(this)}));this._oPopup.setEndButton(new v({text:w.getText("DYNAMIC_DATE_RANGE_CANCEL"),press:this._closePopup.bind(this)}));this._setFooterVisibility(false);this._oPopup._getPopup().setAutoClose(true);this.setAggregation("_popup",this._oPopup,true)}};H.prototype._createValueHelpItems=function(){var t;var e;var o=[];var i=this._getOptions();i.sort(function(t,e){var o=t.getGroup()-e.getGroup();if(o){return o}return L.indexOf(t.getKey())-L.indexOf(e.getKey())});i=i.reduce(function(o,i){if(A.LastXKeys.indexOf(i.getKey())!==-1){if(t){return o}t=true}if(A.NextXKeys.indexOf(i.getKey())!==-1){if(e){return o}e=true}o.push(i);return o},[]);if(this.getEnableGroupHeaders()){i=i.reduce(function(t,e){var i=e.getGroupHeader();if(o.indexOf(i)===-1){o.push(i);t.push(i)}t.push(e);return t},[])}return i.map(function(t){if(typeof t==="string"){return this._createHeaderListItem(t)}return this._createListItem(t)},this)};H.prototype._createListItem=function(t){var e=this._isFixedOption(t);return new K({type:e?E.Active:E.Navigation,title:t.getText(this),wrapping:true,optionKey:t.getKey(),press:this._handleOptionPress.bind(this)})};H.prototype._createHeaderListItem=function(t){var e=new f;e.setTitle(t);e._bGroupHeader=true;return e};H.prototype._handleOptionPress=function(t){var e=t.getSource().getOptionKey(),o=p.getOption(e);this._oSelectedOption=o;if(this._isFixedOption(o)){this._applyValue()}else{var i=this._createInfoDatesFooter();this._destroyInputControls();this.aInputControls=o.createValueHelpUI(this,this._updateInternalControls.bind(this));var a=this._oNavContainer.getPages()[1];a.removeAllContent();this.aInputControls.forEach(function(t){a.addContent(t)});a.setFooter(i);a.setTitle(o.getText(this));this._setFooterVisibility(true);this._updateInternalControls(o);this._oNavContainer.to(a)}};H.prototype._isFixedOption=function(t){return!t.getValueHelpUITypes(this).length};H.prototype._createInfoDatesFooter=function(){this._infoDatesFooter=new b({design:F.Info,style:S.Clear,content:[new _({text:w.getText("DDR_INFO_DATES_EMPTY_HINT")})]});return this._infoDatesFooter};H.prototype._getDatesLabel=function(){return this._infoDatesFooter.getContent()[0]};H.prototype._updateDatesLabel=function(){var t=this._oSelectedOption.getValueHelpOutput(this),e,o;if(!t||!t.operator||!p.getOption(t.operator)){return}e=p.toDates(t);if(e){o=this._getDatesLabelFormatter().format(e);this._getDatesLabel().setText(w.getText("DDR_INFO_DATES",[o]))}};H.prototype._setApplyButtonEnabled=function(t){if(!this._oPopup){return}var e=this._oPopup.getBeginButton();if(e.getVisible()){e.setEnabled(t)}};H.prototype._updateInternalControls=function(t){var e=t.validateValueHelpUI(this);if(e){this._updateDatesLabel()}this._setApplyButtonEnabled(e)};H.prototype._setFooterVisibility=function(t){var e;if(!this._oPopup){return}e=this._oPopup.getAggregation("_popup");if(d.system.phone){this._oPopup.getBeginButton().setVisible(t)}else{e.getFooter().setVisible(t)}e.invalidate();return this};H.prototype._createPopupContent=function(){var t=new P({showHeader:false,showNavButton:false}),e=new P({showHeader:true,showNavButton:true}).addStyleClass("sapMDynamicDateRangePopover");e.attachNavButtonPress(function(){this._setFooterVisibility(false);this._oNavContainer.back()},this);if(d.system.phone){t.setShowHeader(true);t.setTitle(this._getOptionsPageTitleText())}if(!this._oOptionsList){this._oOptionsList=new m({showSeparators:B.None,mode:x.None})}if(!this._oNavContainer){this._oNavContainer=new O({autoFocus:false});this._oNavContainer.addPage(t);this._oNavContainer.setInitialPage(t);this._oNavContainer.addPage(e);this._oNavContainer.attachAfterNavigate(this._navContainerAfterNavigate,this);this._oPopup.addContent(this._oNavContainer)}this._oNavContainer.getPages()[0].removeAllContent();this._oNavContainer.getPages()[0].addContent(this._oOptionsList);return this._oOptionsList};H.prototype._applyNavContainerPageFocus=function(t){var e=this.getValue(),o=this._oNavContainer.getPages()[0],i;if(t===o&&e){i=this._oOptionsList.getItems().find(function(t){return t.isA("sap.m.DynamicDateRangeListItem")&&t.getOptionKey()===e.operator})}if(!i){i=jQuery(t.getDomRef().querySelector("section")).firstFocusableDomRef()}i.focus();this._reApplyFocusToElement(t,e)};H.prototype._reApplyFocusToElement=function(t,e){};H.prototype._getOptionsPageTitleText=function(){return l.getReferencingLabels(this).concat(this.getAriaLabelledBy()).reduce(function(t,o){var i=e.registry.get(o);return t+" "+(i.getText?i.getText():"")},"").trim()};H.prototype._navContainerAfterNavigate=function(t){var e=this._oNavContainer.getPages()[1],o=t.getParameters()["to"];if(o===e){this.aInputControls.forEach(function(t){if(jQuery(t.getDomRef()).firstFocusableDomRef()){t.addAriaLabelledBy(o.getAggregation("_internalHeader"));if(!this._isCalendarBasedControl(t)&&t.addAriaDescribedBy){t.addAriaDescribedBy(o.getFooter().getContent()[0])}}},this)}if(this._oPopup&&this._oPopup.isOpen()){this._applyNavContainerPageFocus(o)}else{this.getAggregation("_input").focus()}};H.prototype._isCalendarBasedControl=function(t){return t.isA("sap.ui.unified.Calendar")||t.isA("sap.ui.unified.calendar.CustomMonthPicker")||t.isA("sap.ui.unified.calendar.MonthPicker")||t.isA("sap.ui.unified.calendar.YearPicker")||t.isA("sap.ui.unified.calendar.YearRangePicker")||t.isA("sap.ui.unified.calendar.Month")};H.prototype._openPopup=function(){if(!this._oPopup){return}this._oPopup._getPopup().setAutoCloseAreas([this._oInput.getDomRef()]);this._oPopup.openBy(this._oInput)};H.prototype._applyValue=function(){this._oOutput=this._oSelectedOption.getValueHelpOutput(this);var t=this.getValue();this.setValue(this._oOutput);this.fireChange({prevValue:t,value:this.getValue(),valid:true});this._closePopup()};H.prototype._closePopup=function(){this._setFooterVisibility(false);this._oNavContainer.to(this._oNavContainer.getPages()[0]);this._oPopup.close()};H.prototype._getFormatter=function(){var t=this.getFormatter(),e;if(t){return t}if(this.oBoundValueFormatter){return this.oBoundValueFormatter}e=this.getBinding("value");if(e&&e.getType()){this.oBoundValueFormatter=r.getInstance(e.getType().oFormatOptions);return this.oBoundValueFormatter}if(!this.oDefaultFormatter){this.oDefaultFormatter=r.getInstance()}return this.oDefaultFormatter};H.prototype._formatValue=function(t){return p.getOption(t.operator).format(t,this._getFormatter())};H.prototype._parseValue=function(t){var e=p.parse(t,this._getFormatter()).filter(function(t){return this.getOptions().indexOf(t.operator)!==-1},this);return e.length?e[0]:null};H.prototype._substitudeValue=function(t){var e,o,i;if(!t||!t.operator||!t.values){return t}e=t.operator;o=t.values;if(e==="LASTDAYS"&&o[0]===1){i={operator:"YESTERDAY",values:[]}}else if(e==="NEXTDAYS"&&o[0]===1){i={operator:"TOMORROW",values:[]}}else if((e==="LASTDAYS"||e==="NEXTDAYS")&&o[0]===0){i={operator:"TODAY",values:[]}}return i?i:t};var M=n.extend(D);M.apiVersion=2;M.getAriaRole=function(t){return"combobox"};M.writeInnerAttributes=function(t,e){t.attr("type","text")};M.getAccessibilityState=function(t){var e=D.getAccessibilityState(t),o=t._getControlOrigin(),i=o.getAriaLabelledBy(),n=l.getReferencingLabels(o),s=o.getAriaDescribedBy().join(" "),r;r=n.concat(i).join(" ");if(s){e.describedby=s}if(r){e.labelledby=r}e.roledescription=w.getText("ACC_CTR_TYPE_DYNAMIC_DATE_RANGE");e.role=this.getAriaRole();e.expanded=o._oPopup?o._oPopup.isOpen():false;e.haspopup=a.aria.HasPopup.ListBox.toLowerCase();e.autocomplete="list";e.controls=o._oPopup&&o._oPopup.getDomRef()?o._oPopup.getDomRef().id:undefined;return e};var U=I.extend("sap.m.internal.DynamicDateRangeInput",{metadata:{library:"sap.m"},renderer:M});U.prototype._setControlOrigin=function(t){this._oOriginControl=t;return this._oOriginControl};U.prototype._getControlOrigin=function(){return this._oOriginControl};U.prototype.preventChangeOnFocusLeave=function(t){return this.bFocusoutDueRendering};var K=c.extend("sap.m.DynamicDateRangeListItem",{metadata:{library:"sap.m",properties:{optionKey:{type:"string",group:"Misc",defaultValue:null}}},renderer:y});K.prototype.getNavigationControl=function(){var t=c.prototype.getNavigationControl.apply(this,arguments),e=["SPECIFICMONTH","DATE","DATERANGE","FROM","TO"].includes(this.getOptionKey()),o=e?u.getIconURI("appointment-2"):u.getIconURI("slim-arrow-right");if(e){t.addStyleClass("sapMDDRDateOption")}t.setSrc(o);return t};function Y(t){var e=t;while(e&&e.classList){if(e.classList.contains("sapUiSizeCompact")){return true}e=e.parentNode}return false}return H});