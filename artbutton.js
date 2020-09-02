function prepShowArtKeybinding(placeable, control) {
	let doc = $(document);
	doc.off("keydown.artButton");
	if (!control) return;

	doc.on("keydown.artButton", (event) => {
		if (event.shiftKey && event.key == "Z") {
			let pop = new ImagePopout(placeable.data.img, {
				title: placeable instanceof Token ? game.i18n.localize("DND5E.Name") : game.i18n.localize("TKNHAB.TileImage"),
				shareable: true
			}).render(true);
			if (!event.altKey && game.user.isGM) pop.shareImage();
		}
	});
}

Hooks.on("controlTile", prepShowArtKeybinding);
Hooks.on("controlToken", prepShowArtKeybinding);

Hooks.on("renderTileHUD", (hud, html, tile) => {
	let artButton = document.createElement("div");
	html.focus();

	artButton.classList.add("control-icon");
	artButton.classList.add("artwork-open");
	artButton.innerHTML = `<i class="fas fa-image fa-fw"></i>`
	artButton.title = game.i18n.localize("TKNHAB.TooltipText");

	$(artButton).click((event) => {
		let pop = new ImagePopout(tile.img, {
			title: game.i18n.localize("TKNHAB.TileImage"),
			shareable: true
		}).render(true);
		if (event.shiftKey && game.user.isGM) pop.shareImage();
	});

	html.find("div.left").append(artButton);
});
Hooks.on("renderTokenHUD", (hud, html, token) => {
	let actor = game.actors.get(token.actorId); 
	let synthActor = token.actorData;

	let artButton = document.createElement("div");
	
	artButton.classList.add("control-icon");
	artButton.classList.add("artwork-open");
	artButton.innerHTML = `<i class="fas fa-image fa-fw"></i>`
	artButton.title = game.i18n.localize("TKNHAB.TooltipText");
	
	let showName = 	token.displayname == CONST.TOKEN_DISPLAY_MODES.ALWAYS ||
					token.displayname == CONST.TOKEN_DISPLAY_MODES.HOVER
	let hiddenName = game.i18n.localize("DND5E.Name");

	let actorImg = synthActor.img || actor.data.img;
	let tokenImg = token.img;

	let am = actorImg === "icons/svg/mystery-man.svg";
	let tm = tokenImg === "icons/svg/mystery-man.svg";
	
	if (!(am && tm)) {
		actorImg = am ? tokenImg : actorImg;
		tokenImg = tm ? actorImg : tokenImg;
	}

	$(artButton).click((event) => {
		let pop = new ImagePopout(actorImg , {
			title: showName ? synthActor.name || actor.name : hiddenName,
			shareable: true,
			uuid: actor.uuid
		}).render(true);
		if (event.shiftKey && game.user.isGM) pop.shareImage();
	});
	$(artButton).contextmenu((event) => {
		let pop = new ImagePopout(tokenImg, {
			title: showName ? token.name : hiddenName,
			shareable: true,
		}).render(true);
		if (event.shiftKey && game.user.isGM) pop.shareImage();
	});

	html.find("div.left").append(artButton);
});