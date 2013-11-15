function bug(msg){
    //Criei essa função só para debugar o codigo mais facil
	!msg ? alert("here") : alert(msg);
}
var xml;
var Element={
    //Classe mãe
    //Abaixo alguns atribudos da aplicação que serão uteis em outros objetos
    elPageMenu:$(".pagemenu"),
    elContent:$(".content"),
    elContainer:$("#container"),
    elMenu:$("nav"),
    loading:!1,
    modalPage:$("#cart"),
    mask:$(".mask"),
    change:function(hash,json){
    //Metodo executado a cada mudança de hash
        $(".label label").click(function(a){
        	//Ao clicar no label do input de pesquisa de games
            $(a.target).parent().find("input[type='text']").focus();
        });
        $(".label input[type='text']").focus(function(){
        	//Ao focar o input de pesquisa do game
            $(this).parent().find("label").fadeOut();
        }).blur(function(){
            if(!$(this).val()) $(this).parent().find("label").fadeIn();
        });
        
        menu=new Menu();
        cart=new Cart();
        cart.load();
        $(".bcart").removeClass("sel"); //Ao trocar de tela o botão do carrinho precisa voltar ao normal
        this.json=json;
        Element.close();
        if(!hash || hash==="games"){
            this.breadBox("Games");
            games=new Games();
            /*if($("#search").hasClass("hide")){
                $("#search").removeClass("hide");
            }*/
            games.load();
        }
        else{
            //$("#search").addClass("hide");
            switch(hash){
                case "sobre":
                    sobre=new Sobre();
                    this.breadBox(hash.replace("#","").initialCaps());
                    sobre.load();
                    break;
                case "contato":
                    contato=new Contato();
                    this.breadBox(hash.replace("#","").initialCaps()); //InitialCaps para primeira letra maiuscula (method.js)
                    contato.load();
                    break;
                case "minhaconta":                  
                    minhaConta=new MinhaConta();
                    this.breadBox("Minha Conta");
                    minhaConta.load();
                    break;
                case "meuspedidos":
                    meusPedidos=new MeusPedidos();
                    this.breadBox("Meus Pedidos");
                    meusPedidos.load();
                    break;
                case "televendas":
                    teleVendas=new TeleVendas();
                    this.breadBox("Televendas");
                    teleVendas.load();
                    break;
                default:
                    notFound=new NotFound();
                    this.breadBox("Página não Encontrada");
                    notFound.load();
            }
        }
    },
    open:function(){
        //Abre janela modal
        this.modalPage.height(this.elContainer.height()-160); //tamanho do container do modal sera de acordo com o container abaixo dele
        this.modalPage.fadeIn();
        
    },
    close:function(){
            //Pega o modal aberto e fecha. Caso a janela abaixo seja
           this.modalPage.fadeOut();
    },
    breadBox:function(atual){
        //Atualiza BreadCrumb
        this.el=$(".bread-search");
        this.el.find("span").not(".inicial").not(".separador").text(atual);
    },
    maskOpen:function(loader){
    	//Abre a mascara com loader
        $("body").addClass("noscroll");
        this.mask.fadeIn();
        if(loader){
            this.mask.find(".loader").fadeIn();
        }
    },
    maskClose:function(loader){
    	//Fecha a mascara com loader
        if(loader){
            setTimeout(function(){
                $(".mask").fadeOut().find(".loader").fadeOut();
                $("body").removeClass("noscroll");
                Element.loading=!1;
                console.log(Element.loading);
            },1500);
        }
        else{
            $(".mask").fadeOut();
            $("body").removeClass("noscroll");
        }
    }
    
};

var Menu=function(){
    //Classe Menu
    this.change=function(atual){
        Element.elPageMenu.find("a").removeClass("sel");
        //Ao mudar a opção do menu selecionado
    	$(this.elMenu).find("a").bind("click",function(){
            //Caso o menu clicado for igual ao hash, forçamos o carrinho a fechar, já que o hash não foi mudado
            if($(this).attr("href").replace("#","")===atual){
                $(".bcart").removeClass("sel");
                $(this).hasClass("sel") || Element.elMenu.find("a").removeClass("sel"),$(this).addClass("sel");
                $("#cart").fadeOut();
            }
    	});
        if(atual===""){
            //Caso não tenha hash, a tela sera games então o menu será games. Então a tela atual é games
            atual="games";
        }
        $(this.elMenu).find("a").each(function(){
            //Muda o menu de acordo com o hash
            if($(this).attr("href").replace("#","")===atual){
                $(this).hasClass("sel") || Element.elMenu.find("a").removeClass("sel"),$(this).addClass("sel");
            }
        });
    };
    this.disable=function(){
        //desabilita o menu ao abrir o carrinho
        Element.elMenu.find("a").removeClass("sel");
    };
};


var Cart=function(){
   this.el=$("#cart");
   this.bcart=$("a.bcart");
   this.itens_venda=[];
   this.load=function(){
       //Da inicio ao load do cart
        $("a.bcart").click(function(a){
            if($(this).hasClass("sel")){
                return false;
            }
            else{
                $(this).addClass("sel");
                a.preventDefault();
                menu.disable();
                Element.close(); //Fecha o modal que estiver aberto, caso esteja
                Element.modalPage=cart.el; //Indica a classe mãe que o carrinho esta aberto
                Element.maskOpen(true);
                cart.render();
                Element.maskClose(true);
            }
        });
   };
    this.el.find(".title a").bind({
        //Ao clicar no botão fechar
        click:function(a){
            a.preventDefault();
            $(".bcart").removeClass("sel");
            Element.close();
            menu.change(window.location.hash.replace("#",""));
        }
    });
    this.el.find(".cont").bind("click",function(){
        //Ao clicar no botão continuar busca
        cart.bcart.removeClass("sel");
        Element.close();
    });
   this.add=function(id){
       //Ao adicionar itens ao carrinho
        var id=parseInt(id)-1;
        this.itens_venda.push(Element.json[id]);
        Element.json[id].incart=true;
        $(this.bcart).find("span").text(this.itens_venda.length);
   };
    this.render=function(){
        //Abre o carrinho
        var length,car,i,html="",json,item,select,id,preco,total=0;
        select="<select name='unidade' class='button'><option value='1' name='quantidade'>1 Unidade</option><option value='2' name='quantidade'>2 Unidade</option><option value='3' name='quantidade'>3 Unidade</option><option value='4' name='quantidade'>4 Unidade</option><option value='5' name='quantidade'>5 Unidade</option><option value='6' name='quantidade'>6 Unidade</option><option value='7' name='quantidade'>7 Unidade</option><option value='8' name='quantidade'>8 Unidade</option><option value='9' name='quantidade'>9 Unidade</option></select>";
        json=Element.json;
        car=this.input.val().replace(" ","");
        length=car.length;
        for(i=0;i<length;i++){
        	//Criar as linhas da tabela carrinho com os itens adicionados ao mesmo
        	item=parseInt(car[i])-1;
        	if(!isNaN(item)){
        		if(i%2){
        			html+="<tr class='"+json[item].cod+" odd'>";
	        	}
	        	else{
	        		html+="<tr class='"+json[item].cod+"'>";
	        	}
	        	html+="<td><img src='./images/games/cart/"+json[item].cod+".jpg'/>"+json[item].name+"</td>";
	        	html+="<td class='val'>"+json[item].preco.replace(".",",")+"</td>";
	        	html+="<td>"+select+"</td>";
	        	html+="<td><input type='text' value='' disabled='disable' class='disabled'/></td>";
	        	html+="<td><a href='#"+json[item].cod+"' class='button'></a></td></tr>";
        	}
        }
        $("#cart tbody.scrollContent").html(html);        
        $("#cart tr a").click(function(a){
        	//Ao clicar no botão remover do carrinho da tabela carrinho
            id=$(this).attr("href").replace("#","");
        	a.preventDefault();
            $("a[href='#"+id+"']").removeClass("remove-cart");
        	cart.remove(id);
        	$(this).closest("tr").remove();
                
        });
        this.el.find("select").change(function(){
        	//Ao alterar a quantidade de itens na compra
            preco=parseFloat($(this).closest("tr").find(".val").text().replace(",","."));
            $(this).closest("tr").find("td input").val($(this).val()*preco);
            total+=preco;
            cart.price(total);
        }).trigger("change");
        Element.open();
        $("#cart .send").click(function(a){
            a.preventDefault();
            alert("voltando");
        });
    };
    this.price=function(total){
    	//Atualizando o preco total da compra
        this.el.find(".button-box").find("div").html("<span>R$ </span>"+String(total).replace(".",","));
    };
    
    this.remove=function(id){
        //Remove itens do carrinho
        var id,length,i;
        var id=parseInt(id)-1;
        length=this.itens_venda.length;
        Element.json[id].incart=false;
        for(i=0;i<length;i++){
            if(this.itens_venda[i].cod===id+1){
                id=i;
            }
        }
        this.itens_venda.splice(id,1);
        $(this.bcart).find("span").text(this.itens_venda.length);
    };
};

var Games=function(){
    //Classe dos games
    var link;
    this.filter;        
    this.load=function(){
        //Carrega xml dentro do content
       xml.each(function(){
            if($(this).attr("name")==="games"){
               Element.elContent.html($(this).find("code").text());
            }
        });
        this.render();
    };
    this.render=function(){
        //chamada do creatbox com os lançamentos e filtrados
        menu.change("games");      
        filtro=filterBy(Element.json,'lanc',"true");
        this.creatBox(filtro,"Lançamento");
        this.elContainer.fadeIn(); //Exibe o conteudo inserido
    };
    this.creatBox=function(filtro,search){
        //Metodo que cria os games na tela de acordo com o filtro passado com parametro
        this.filter=filtro;
        var i,length=filtro.length,html="";
        this.result=$(".result");
        this.accordion=$(".result .accordion");
        this.sidebar=$(".sidebar");
        this.result.find(".box").remove();
        Element.maskOpen(true);
        this.accordion.find(".count").find("span").html(filtro.length);
        this.accordion.find(".search").find("span").html(search);
        Element.maskClose(true);
        for(i=0;i<length;i++){
            //Para cada linha do json(filtrado) cria um box com as propriedades
            html+="<div class='box' id='"+filtro[i].cod+"'>";
            html+="<img src='./images/games/large/"+filtro[i].cod+".jpg'/>";
            html+="<div class='box-info'><h1>"+filtro[i].name+"</h1><h4>"+filtro[i].category+"</h4><h2><span>R$</span>"+filtro[i].preco.replace(".",",")+"</h2><div class='button-cart'>";
            if(!filtro[i].incart){
                html+="<a href='#"+filtro[i].cod+"' class='button add-cart'></a></div></div>";
            }
            else{
                html+="<a href='#"+filtro[i].cod+"' class='button add-cart remove-cart'></a></div></div>";
            }
            html+="</div>";
        };
        this.result.append(html); //Joga o html dentro da div result
        this.result.find(".box").bind("click",function(){
            //Ao clicar em algum dos games
            detail=new Detail();
            detail.creat($(this).attr("id"),$(this).find("a").hasClass("remove-cart"));
        });
        $(".bsearch").click(function(a){
        	//Ao se clicar no botão de pesquisa do input pesquisa
            a.preventDefault();
            var text=$("input[name='search']").val().toLowerCase(); //transforma o texto digitado para letras minusculas
            if(!text){
            	//Caso não exista texto e o usuario clique em pesquisar
                return false;
            }
            else{
                games.sidebar.find("a").removeClass("sel"); //Remove a seleçao de todas as categorias
                Element.close(); //Fecha qualquer modal que esteja aberto
                for(var i=0;i<Element.json.length;i++){
                	//Cria atributo temporario no json de games com o nome do game em letra minuscula
                    Element.json[i].temp=Element.json[i].name.toLowerCase();
                }
                filtro=filterBy(Element.json,'temp',text);
                games.creatBox(filtro,text.initialCaps());
                $("input[name='search']").val("").blur();  //Retira o blur do input de busca
                for(var i=0;i<Element.json.length;i++){
                    delete Element.json[i].temp;
                    //Deleta o atributo temporario criado
                }
            }
        });
        this.sidebar.find("a").click(function(a){
        	//Ao selecionar uma categoria no menu sidebar dos games
            a.preventDefault();
            if(!$(this).hasClass("sel")){
            	//Caso o link selecionado já não esteja selecionado
                $(this).addClass("sel");
                $(this).parent().siblings().each(function(a,b){
                    $(this).find("a").removeClass("sel").addClass("disable");
                });
                link=$(this).attr("href").replace("#","");
                filtro=filterBy(Element.json,'link',link);
                games.creatBox(filtro,filtro[1].category); //Chamada do metodo de criação dos box de games
                return true;
            }
            else{
                return false;
            }
        });
        this.result.find(".button-cart a").bind("click",function(a){
            //Ao clicar no botão carrinho
            a.preventDefault();
            if($(this).hasClass("remove-cart")){
                cart.remove($(this).attr("href").replace("#"," "));
                $(this).removeClass("remove-cart");
            }
            else{
                $(this).addClass("remove-cart");
                cart.add($(this).attr("href").replace("#"," "));
            }            
            return false;
        });
    };
    
    var Detail=function(){
        //Sub Classe Detail de Games
        this.el=$("#detail");
       this.creat=function(id,status_cart){
           //Cria modal de detalhes de acordo com o game clicado
           var i=0,id=parseInt(id),img,json;
           json=games.filter;
           $('html, body').animate({
               //Sobre a barra de rolagem
                scrollTop: 0  
            }, 800);
           this.desc=$(".desc-side");
           this.info=$(".info-side");
           this.require=$(".require-side");
            for(i=0;i<json.length;i++){
                //Passa em cada linha do json
                if(json[i].cod===id){
                    //Caso o codigo da linha seja igual ao game clicado
                    this.el.find(".title p").text(json[i].name);
                    this.desc.find("img").attr("src","./images/games/thumb/"+id+".jpg");
                    this.desc.find(".desc").find(".category").text(json[i].category);
                    this.desc.find(".desc").find(".desenvolvedora").text(json[i].desenvolvedor);
                    this.desc.find(".desc").find(".d_lanc").text(json[i].date);
                    this.info.find(".info").text(json[i].descricao);
                    this.info.find(".price").find(".valor").text(json[i].preco.replace(".",","));
                    this.info.find(".price").find("a").attr("href","#"+id);
                    this.require.find(".proc").text(json[i].processador);
                    this.require.find(".v_proc").text(json[i].velocidade_proc);
                    this.require.find(".ram").text(json[i].ram);
                    this.require.find(".ram").text(json[i].ram);
                    this.require.find(".hd").text(json[i].hd);
                    this.require.find(".video").text(json[i].video);
                    this.require.find(".m_video").text(json[i].mem_video);
                    this.require.find(".so").text(json[i].so);
                    //Status do botão carrinho
                    if(status_cart){
                        this.info.find(".price").find("a").addClass("remove-cart");
                    }
                    else{
                        this.info.find(".price").find("a").removeClass("remove-cart");
                    }
                }
            }

            Element.modalPage=this.el; //Indica a classe mae que o detail está aberto
            Element.open();
            this.el.find(".title a").bind({
                click:function(a){
                    //Ao clicar no fechar
                    a.preventDefault();
                    Element.close();
                }
            });
            $(".price").find("a").unbind("click").bind("click",function(a){
                /*Ao clicar no botão carrinhho (Unbind utilizado, pois quando o botão é pressionado a função era executada duas vezes*/
                a.preventDefault();
                if($(this).hasClass("remove-cart")){
                    $("a[href='#"+id+"']").removeClass("remove-cart");
                    cart.remove($(this).attr("href").replace("#"," "));
                }
                else{
                    $("a[href='#"+id+"']").addClass("remove-cart");
                    cart.add($(this).attr("href").replace("#"," "));
                }  
            });
       };
    };
};

var TeleVendas=function(){
    //Classe televendas
    this.load=function(){
       xml.each(function(){
            if($(this).attr("name")==="televendas"){
               Element.elContent.html($(this).find("code").text());
            }
        });
        this.render();
    };
    this.render=function(){
            menu.disable();
            Element.elPageMenu.find("a").removeClass("sel"),$("a[href='#televendas']").addClass("sel");
            this.elContainer.fadeIn();
    };
};

var Sobre=function(){
    //Classe sobre
    this.load=function(){
       xml.each(function(){
            if($(this).attr("name")==="sobre"){
               Element.elContent.html($(this).find("code").text());
            }
        });
        this.render();
    };
    this.render=function(){
            menu.change("sobre");
            Element.elContainer.fadeIn();
    };
};

var MinhaConta=function(){
    //Classe minha conta
    this.load=function(){
        menu.disable();
        Element.elPageMenu.find("a").removeClass("sel"),$("a[href='#minhaconta']").addClass("sel");
        xml.each(function(){
             if($(this).attr("name")==="minhaconta"){
                Element.elContent.html($(this).find("code").text());
             }
         });
         this.render();
    };
    this.render=function(){
            menu.disable();
            this.elContainer.fadeIn();
    };
};

var MeusPedidos=function(){
    //Classe meus pedidos
    this.load=function(){
        menu.disable();
        Element.elPageMenu.find("a").removeClass("sel"),$("a[href='#meuspedidos']").addClass("sel");
        xml.each(function(){
             if($(this).attr("name")==="meuspedidos"){
                Element.elContent.html($(this).find("code").text());
             }
         });
         this.render();
    };
    this.render=function(){
            menu.disable();
            this.elContainer.fadeIn();
    };
};

var NotFound=function(){
        //Classe para tela não encontrada
    this.load=function(){
        xml.each(function(){
             if($(this).attr("name")==="notfound"){
                Element.elContent.html($(this).find("code").text());
             }
         });
         this.render();
    };
    this.render=function(){
            menu.disable();
            Element.elPageMenu.find("a").removeClass("sel");
            this.elContainer.fadeIn();
    };
};

//Fazendo a herança entre as classes
Menu.prototype=Element;
Cart.prototype=Element;
Games.prototype=Element;
TeleVendas.prototype=Element;
MinhaConta.prototype=Element;
NotFound.prototype=Element;
MeusPedidos.prototype=Element;

$.getJSON( "js/ajax/games.js", function(json) {
    //Tudo começa por aqui
    $.ajax({
            //verifica se existe o xml para load das paginas
             type:"GET",
             url:"load.xml",
             dataType:"xml",
             success:function(e){
                 xml=$(e).find("entry");
                 $(window).bind("hashchange", function(){
                     //Caso o xml exista e o hash seja alterado chama o metodo do classe mãe abaixo
                    Element.change(window.location.hash.replace("#",""),json);
                    //Depois de tudo exibe a pagina que por enquanto esta oculta
                    $("#wrap").fadeIn();
                }).trigger("hashchange"); //trigger para assim que entrar no sistema já chamar o metodo acima
                //$(".bcart").find("span").text($(".itens").val().replace(" ","").length); /*Verifica a quantidade de itens no carrinho e atualiza o botao*/
             }
    });
    console.log( "success" );
})
.fail(function() {
    ///Em caso de falha
  console.log( "error" );
})
.always(function() {
    //Sempre
  console.log( "complete" );
});