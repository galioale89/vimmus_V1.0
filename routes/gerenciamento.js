require('../app')
require('../model/Proposta')
require('../model/Empresa')
require('../model/Cliente')
require('../model/CustoDetalhado')
require('../model/Cronograma')
require('../model/Tarefas')
require('../model/Vistoria')
require('../model/Plano')
require('../model/Componente')
require('../model/Documento')
require('../model/Compra')

const express = require('express')
const router = express.Router()
const app = express()
const multer = require('multer')

app.set('view engine', 'ejs')

// app.set('view engine', 'ejs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/arquivos/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const uploadfoto = multer({ storage })

const nodemailer = require('nodemailer')
const bcrypt = require("bcryptjs")
const passport = require("passport")

//Configurando envio de e-mail
const transporter = nodemailer.createTransport({ // Configura os parâmetros de conexão com servidor.
    host: 'smtp.umbler.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alexandre@vimmus.com.br',
        pass: '3rdn4x3L@'
    },
    tls: {
        rejectUnauthorized: false
    }
})

const mongoose = require('mongoose')
const Projeto = mongoose.model('projeto')
const Configuracao = mongoose.model('configuracao')
const Empresa = mongoose.model('empresa')
const Realizado = mongoose.model('realizado')
const Cliente = mongoose.model('cliente')
const Usina = mongoose.model('usina')
const Detalhado = mongoose.model('custoDetalhado')
const Cronograma = mongoose.model('cronograma')
const Pessoa = mongoose.model('pessoa')
const Tarefas = mongoose.model('tarefas')
const Equipe = mongoose.model('equipe')
const Vistoria = mongoose.model('vistoria')
const Plano = mongoose.model('plano')
const Componente = mongoose.model('componente')
const Proposta = mongoose.model('proposta')
const Documento = mongoose.model('documento')
const Compra = mongoose.model('compra')

const comparaDatas = require('../resources/comparaDatas')
const dataBusca = require('../resources/dataBusca')
const liberaRecursos = require('../resources/liberaRecursos')
const setData = require('../resources/setData')
const dataMensagem = require('../resources/dataMensagem')
const validaCampos = require('../resources/validaCampos')
const validaCronograma = require('../resources/validaCronograma')
const dataHoje = require('../resources/dataHoje')


const { ehAdmin } = require('../helpers/ehAdmin')

//Configurando pasta de imagens 
// router.use(express.static('imagens'))
// router.use(express.static('public/'))
// router.use(express.static('public/upload'))

const TextMessageService = require('comtele-sdk').TextMessageService
const apiKey = "8dbd4fb5-79af-45d6-a0b7-583a3c2c7d30"


router.get('/consulta', ehAdmin, (req, res) => {
    const { _id } = req.user
    var status = ''
    lista = []
    Proposta.find({ user: _id }).sort({ dataord: 'asc' }).then((proposta) => {
        proposta.forEach((element) => {
            var dtcadastro = ''
            var dtinicio = ''
            var dtfim = ''
            Proposta.findOne({ _id: element._id }).then((lista_proposta) => {
                Cliente.findOne({ _id: element.cliente }).then((lista_cliente) => {
                    Pessoa.findOne({ _id: element.responsavel }).then((lista_responsavel) => {
                        Equipe.findOne({ _id: element.equipe }).then((equipe) => {
                            Documento.findOne({ proposta: element._id }).then((documento) => {
                                Compra.findOne({ proposta: element._id }).then((compra) => {
                                    console.log('lista_proposta=>' + lista_proposta._id)
                                    if (typeof lista_proposta.proposta6 != 'undefined') {
                                        dtcadastro = lista_proposta.dtcadastro6
                                    } else {
                                        if (typeof lista_proposta.proposta5 != 'undefined') {
                                            dtcadastro = lista_proposta.dtcadastro5
                                        } else {
                                            if (typeof lista_proposta.proposta4 != 'undefined') {
                                                dtcadastro = lista_proposta.dtcadastro4
                                            } else {
                                                if (typeof lista_proposta.proposta3 != 'undefined') {
                                                    dtcadastro = lista_proposta.dtcadastro3
                                                } else {
                                                    if (typeof lista_proposta.proposta2 != 'undefined') {
                                                        dtcadastro = lista_proposta.dtcadastro2
                                                    } else {
                                                        dtcadastro = lista_proposta.dtcadastro1
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    // console.log('dtcadastro=>'+dtcadastro)
                                    // console.log('equipe=>' + equipe)
                                    // console.log('documento=>' + documento)
                                    // console.log('compra=>' + compra)
                                    // console.log('lista_proposta=>' + lista_proposta)
                                    // console.log('equipe.feito=>' + equipe.feito)
                                    // console.log('documento.protocolado=>' + documento.protocolado)
                                    // console.log('documento.feitotrt=>' + documento.feitotrt)
                                    // console.log('compra.feitonota=>' + compra.feitonota)
                                    // console.log('compra.feitopedido =>' + compra.feitopedido)
                                    // console.log('lista_proposta.assinado=>' + lista_proposta.assinado)
                                    if (equipe.feito == true && equipe != null) {
                                        console.log('equipe')
                                        dtinicio = equipe.dtinicio
                                        dtfim = equipe.dtfim
                                        status = 'Equipe'
                                    } else {
                                        if (documento.protocolado == true && documento != null) {
                                            console.log('protocolado')
                                            status = 'Protocolado'
                                        } else {
                                            if (documento.feitotrt == true && documento != null) {
                                                console.log('trt')
                                                status = 'TRT'
                                            } else {
                                                if (compra.feitonota == true && compra != null) {
                                                    console.log('nf')
                                                    status = 'NF'
                                                } else {
                                                    if (compra.feitopedido == true && compra != null) {
                                                        console.log('pedido')
                                                        status = 'Pedido'
                                                    } else {
                                                        if (lista_proposta.assinado == true && lista_proposta != null) {
                                                            console.log('assinado')
                                                            status = 'Assinado'
                                                        } else {
                                                            console.log('proposta enviada')
                                                            status = 'Proposta Enviada'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    console.log('status=>' + status)
                                    lista.push({ status, id: lista_proposta._id, cliente: lista_cliente.nome, responsavel: lista_responsavel.nome, dtcadastro: dataMensagem(dtcadastro), dtinicio: dataMensagem(dtinicio), dtfim: dataMensagem(dtfim) })
                                    res.render('principal/consulta', { lista })
                                }).catch((err) => {
                                    req.flash('error_msg', 'Nenhuma compra encontrada.')
                                    res.redirect('/menu')
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Nenhum documento encontrado.')
                                res.redirect('/menu')
                            })
                        }).catch((err) => {
                            req.flash('error_msg', 'Nenhuma equipe encontrada.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Nenhuma pessoa encontrada.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Nenhuma cliente encontrado.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Nenhuma proposta encontrada.')
                res.redirect('/menu')
            })
        })
    }).catch((err) => {
        req.flash('error_msg', 'Nenhuma proposta encontrado<todas>')
        res.redirect('/projeto/consulta')
    })
})

router.get('/proposta/', ehAdmin, (req, res) => {
    const { _id } = req.user
    Cliente.find({ user: _id }).lean().then((cliente) => {
        Pessoa.find({ user: _id, funges: 'checked' }).lean().then((responsavel) => {
            res.render('principal/proposta', { cliente, responsavel })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o responsável.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar clientes cadastrados.')
        res.redirect('/menu')
    })
})

router.get('/proposta/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.find({ user: _id }).lean().then((cliente) => {
            Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
                Pessoa.find({ user: _id, funges: 'checked' }).lean().then((responsavel) => {
                    Pessoa.findOne({ _id: proposta.responsavel }).lean().then((res_proposta) => {
                        Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                            Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                                Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                                    Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                                        res.render('principal/proposta', { cliente, cliente_proposta, res_proposta, responsavel, proposta, vistoria, documento, compra, lista_equipe })
                                    }).catch((err) => {
                                        req.flash('error_msg', 'Não foi possível encontrar a equipe.')
                                        res.redirect('/menu')
                                    })
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possível encontrar a compra.')
                                    res.redirect('/menu')
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Não foi possível encontrar o documento.')
                                res.redirect('/menu')
                            })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a vistoria da proposta.')
                            res.redirect('/menu')
                        })

                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar o responsável da proposta.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar o responsável.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o cliente da prosposta.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar clientes cadastrados.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})

router.get('/visita/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
            Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
                Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                    Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                        Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                            Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                                res.render('principal/visita', { vistoria, cliente_proposta, proposta, documento, vistoria, compra, lista_equipe })
                            }).catch((err) => {
                                req.flash('error_msg', 'Não foi possível encontrar a equipe.')
                                res.redirect('/menu')
                            })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a compra.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar o documento.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o cliente da prosposta.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})

router.get('/assinatura/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                    Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                        Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                            res.render('principal/assinatura', { cliente_proposta, proposta, documento, vistoria, compra, lista_equipe })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a compra.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a compra.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar o documento.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar clientes cadastrados.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})

router.get('/compra/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                    Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                        Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                            res.render('principal/compra', { cliente_proposta, proposta, compra, documento, vistoria, lista_equipe })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a equipe.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar o documento.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar os documentos de compra.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o responsável da proposta.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})

router.get('/trt/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                    Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                        Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                            res.render('principal/trt', { cliente_proposta, proposta, documento, vistoria, compra, lista_equipe })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a equipe.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar a compra.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o documento.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o cliente da proposta.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a prposta.')
        res.redirect('/menu')
    })
})

router.get('/execucao/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    var check = 'unchecked'
    var salva = 'none'
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                    Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                        Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                            // console.log('documento.protocolado=>' + documento.protocolado)
                            if (documento.protocolado) {
                                check = 'checked'
                                salva = 'inline'
                            }
                            res.render('principal/execucao', { cliente_proposta, documento, proposta, check, salva, compra, vistoria, lista_equipe })
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível encontrar a equipe.')
                            res.redirect('/menu')
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                        res.redirect('/menu')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar a compra.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o documento.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o responsável da proposta.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o responsável.')
        res.redirect('/menu')
    })
})

router.get('/equipe/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    var dentro_ins = []
    var fora_ins = []
    var qi = 0
    var encontrou_ins = false
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente) => {
            Documento.findOne({ proposta: req.params.id }).lean().then((documento) => {
                Compra.findOne({ proposta: req.params.id }).lean().then((compra) => {
                    Vistoria.findOne({ proposta: req.params.id }).lean().then((vistoria) => {
                        Equipe.find({ user: _id, nome: { $exists: true }, ehpadrao: true }).lean().then((equipes) => {
                            console.log('documento.protocolado=>' + documento.protocolado)
                            if (typeof proposta.equipe != 'undefined' && proposta.equipe != '') {
                                console.log('proposta.equipe=>' + proposta.equipe)
                                Equipe.findOne({ _id: proposta.equipe }).lean().then((lista_equipe) => {
                                    console.log('encontrou equipe na proposta')
                                    var lista_instaladores = [lista_equipe.ins0, lista_equipe.ins1, lista_equipe.ins2, lista_equipe.ins3, lista_equipe.ins4, lista_equipe.ins5, lista_equipe.ele0, lista_equipe.ele1]
                                    Pessoa.find({ user: _id, $or: [{ funins: 'checked' }, { funele: 'checked' }] }).then((instaladores) => {
                                        console.log('encontrou instaladores')
                                        instaladores.forEach((element) => {
                                            encontrou_ins = false
                                            for (i = 0; i < lista_instaladores.length; i++) {
                                                if (lista_instaladores[i] == element.nome) {
                                                    dentro_ins.push({ id: element._id, nome: element.nome })
                                                    encontrou_ins = true
                                                }
                                            }
                                            if (encontrou_ins == false) {
                                                fora_ins.push({ id: element._id, nome: element.nome })
                                            }
                                            qi++
                                            console.log('qi=>' + qi)
                                            console.log('instaladores.length=>' + instaladores.length)
                                            if (qi == instaladores.length) {
                                                res.render('principal/equipe', { proposta, cliente, equipes, lista_equipe, dentro_ins, fora_ins, compra, vistoria, documento })
                                            }
                                        })
                                    }).catch((err) => {
                                        req.flash('error_msg', 'Falha ao encontrar os instadores.')
                                        res.redirect('/gerenciamento/equipe/' + req.params.id)
                                    })
                                }).catch((err) => {
                                    req.flash('error_msg', 'Falha ao encontrar a equipe.')
                                    res.redirect('/gerenciamento/equipe/' + req.params.id)
                                })
                            } else {
                                res.render('principal/equipe', { proposta, cliente, compra, vistoria, documento, equipes })
                            }
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Falha ao encontrar a equipe.')
                        res.redirect('/gerenciamento/equipe/' + req.params.id)
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
                    res.redirect('/menu')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar a compra.')
                res.redirect('/menu')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o documento.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar a proposta.')
        res.redirect('/gerenciamento/proposta/' + req.params.id)
    })
})

router.get('/financeiro/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            res.render('principal/financeiro', { cliente_proposta, proposta })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o responsável da proposta.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})

router.get('/posvenda/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    Proposta.findOne({ _id: req.params.id }).lean().then((proposta) => {
        Cliente.findOne({ _id: proposta.cliente }).lean().then((cliente_proposta) => {
            res.render('principal/posvenda', { cliente_proposta, proposta })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o responsável da proposta.')
            res.redirect('/menu')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a proposta.')
        res.redirect('/menu')
    })
})


router.get('/dashboard/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        res.render('projeto/gerenciamento/dashboard', { projeto: projeto })
    })

})

router.get('/dashboardliquido/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        res.render('projeto/gerenciamento/dashboardliquido', { projeto: projeto })
    })
})

router.get('/dashboardreal/:id', ehAdmin, (req, res) => {

    Realizado.findOne({ _id: req.params.id }).lean().then((realizado) => {

        Projeto.findOne({ _id: realizado.projeto }).lean().then((projeto) => {

            res.render('projeto/gerenciamento/dashboardreal', { projeto: projeto, realizado: realizado })

        }).catch((err) => {
            req.flash('error_msg', 'Falha interna.')
            res.redirect('/projeto/consulta')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o projeto realizado.')
        res.redirect('/projeto/consulta')
    })
})

router.get('/dashboardrealliquido/:id', ehAdmin, (req, res) => {

    Realizado.findOne({ _id: req.params.id }).lean().then((realizado) => {

        Projeto.findOne({ _id: realizado.projeto }).lean().then((projeto) => {

            res.render('projeto/gerenciamento/dashboardrealliquido', { projeto: projeto, realizado: realizado })

        }).catch((err) => {
            req.flash('error_msg', 'Falha interna.')
            res.redirect('/projeto/consulta')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o projeto realizado')
        res.redirect('/projeto/consulta')
    })
})

router.get('/gerenciamento/:id', ehAdmin, (req, res) => {
    var fatura
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Empresa.findOne({ _id: projeto.empresa }).lean().then((empresa) => {
            Cliente.findOne({ _id: projeto.cliente }).lean().then((cliente) => {
                Cronograma.findOne({ projeto: projeto._id }).then((cronograma) => {
                    if (projeto.fatequ == true) {
                        fatura = 'checked'
                    } else {
                        fatura = 'unchecked'
                    }
                    var libRecursos = liberaRecursos(cronograma.dateplaini, cronograma.dateplafim, cronograma.dateprjini, cronograma.dateprjfim,
                        cronograma.dateateini, cronograma.dateatefim, cronograma.dateinvini, cronograma.dateinvfim,
                        cronograma.datestbini, cronograma.datestbfim, cronograma.dateestini, cronograma.dateestfim,
                        cronograma.datemodini, cronograma.datemodfim, cronograma.datevisini, cronograma.datevisfim)
                    if (projeto.qtdins != '' && typeof projeto.qtdins != 'undefined' && projeto.qtdins != 0) {
                        libRecursos = true
                    }
                    res.render('projeto/gerenciamento/gerenciamento', { projeto, cliente, empresa, fatura, libRecursos })
                }).catch((err) => {
                    req.flash('error_msg', 'Nenhum cronograma encontrado.')
                    res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
                })
            }).catch((err) => {
                req.flash('error_msg', 'Nenhum cliente encontrado.')
                res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
            })
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve uma falha ao buscar o projeto.')
        res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
    })
})

router.get('/custo/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    var ehSimples = false
    var ehLP = false
    var ehLR = false
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {

        Empresa.findOne({ _id: projeto.empresa }).lean().then((empresa) => {
            switch (empresa.regime) {
                case "Simples": ehSimples = true
                    break;
                case "Lucro Presumido": ehLP = true
                    break;
                case "Lucro Real": ehLR = true
                    break;
            }
            Cliente.findOne({ user: _id, _id: projeto.cliente }).lean().then((cliente) => {
                res.render('projeto/gerenciamento/custo', { projeto, empresa, cliente, ehSimples, ehLP, ehLR })
            }).catch((err) => {
                req.flash('error_msg', 'Nenhum cliente encontrado.')
                res.redirect('/cliente/consulta')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve uma falha ao encontrar o empresa.')
            res.redirect('/configuracao/consulta')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Houve uma falha ao encontrar o projeto.')
        res.redirect('/projeto/consulta')
    })
})

router.get('/cronograma/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Cronograma.findOne({ projeto: req.params.id }).lean().then((cronograma) => {
            Realizado.findOne({ projeto: req.params.id }).lean().then((realizado) => {
                var evPerGes = (parseFloat(projeto.totges)) * (parseFloat(cronograma.perGes) / 100)
                if (isNaN(evPerGes)) {
                    evPerGes = 0
                }
                var evPerKit = (parseFloat(projeto.vlrkit)) * (parseFloat(cronograma.perKit) / 100)
                if (isNaN(evPerKit)) {
                    evPerKit = 0
                }
                var evPerIns = (parseFloat(projeto.totint)) * (parseFloat(cronograma.perIns) / 100)
                if (isNaN(evPerIns)) {
                    evPerIns = 0
                }
                var evPerPro = (parseFloat(projeto.totpro)) * (parseFloat(cronograma.perPro) / 100)
                if (isNaN(evPerPro)) {
                    evPerPro = 0
                }
                var evPerArt = (parseFloat(projeto.vlrart)) * (parseFloat(cronograma.perArt) / 100)
                if (isNaN(evPerArt)) {
                    evPerArt = 0
                }
                var evPerAli = (parseFloat(projeto.totali)) * (parseFloat(cronograma.perAli) / 100)
                if (isNaN(evPerAli)) {
                    evPerAli = 0
                }
                var evPerDes = (parseFloat(projeto.totdes)) * (parseFloat(cronograma.perDes) / 100)
                if (isNaN(evPerDes)) {
                    evPerDes = 0
                }
                var evPerHtl = (parseFloat(projeto.tothtl)) * (parseFloat(cronograma.perHtl) / 100)
                if (isNaN(evPerHtl)) {
                    evPerHtl = 0
                }
                var evPerCmb = (parseFloat(projeto.totcmb)) * (parseFloat(cronograma.perCmb) / 100)
                if (isNaN(evPerCmb)) {
                    evPerCmb = 0
                }
                var evPerCer = (parseFloat(projeto.totcer)) * (parseFloat(cronograma.perCer) / 100)
                if (isNaN(evPerCer)) {
                    evPerCer = 0
                }
                var evPerCen = (parseFloat(projeto.totcen)) * (parseFloat(cronograma.perCen) / 100)
                if (isNaN(evPerCen)) {
                    evPerCen = 0
                }
                var evPerPos = (parseFloat(projeto.totpos)) * (parseFloat(cronograma.perPos) / 100)
                if (isNaN(evPerPos)) {
                    evPerPos = 0
                }
                var cpi
                var tcpi
                if (projeto.cpi < 1) {
                    cpi = false
                } else {
                    cpi = true
                }
                if (projeto.tcpi < 1) {
                    tcpi = true
                } else {
                    tcpi = false
                }

                var libRecursos = liberaRecursos(cronograma.dateplaini, cronograma.dateplafim, cronograma.dateprjini, cronograma.dateprjfim,
                    cronograma.dateateini, cronograma.dateatefim, cronograma.dateinvini, cronograma.dateinvfim,
                    cronograma.datestbini, cronograma.datestbfim, cronograma.dateestini, cronograma.dateestfim,
                    cronograma.datemodini, cronograma.datemodfim, cronograma.datevisini, cronograma.datevisfim)

                //console.log('libRecursos=>'+libRecursos)                                                
                res.render('projeto/gerenciamento/cronograma', {
                    projeto, cronograma, realizado, cpi, tcpi, libRecursos,
                    evPerGes, evPerKit, evPerIns, evPerPro, evPerArt, evPerAli, evPerDes, evPerHtl, evPerCmb, evPerCer, evPerCen, evPerPos
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o realizado.')
                res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o cronograma.')
            res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o projeto.')
        res.redirect('/gerenciamento/gerenciamento/' + req.params.id)
    })
})

router.get('/documentos/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        res.render('projeto/gerenciamento/documentos', { projeto })
    })
})

router.get('/cenarios/', ehAdmin, (req, res) => {
    res.render('projeto/gerenciamento/cenarios')
})

router.get('/agenda/', ehAdmin, (req, res) => {

    const { _id } = req.user

    var hoje = new Date()
    var ano = hoje.getFullYear()
    var mes = parseFloat(hoje.getMonth()) + 1
    if (mes < 10) {
        mes = '0' + mes
    }
    dataini = ano + mes + '01'
    datafim = ano + mes + '31'

    var janeiro
    var fevereiro
    var marco
    var abril
    var maio
    var junho
    var julho
    var agosto
    var setembro
    var outubro
    var novembro
    var dezembro
    var mestitulo = ''

    //console.log('mes=>'+mes)

    //console.log('mes=>' + mes)

    switch (mes) {
        case 01: janeiro = 'selected';
            mestitulo = 'Janeiro'
            break;
        case 02: fevereiro = 'selected';
            mestitulo = 'Fevereiro'
            break;
        case 03: marco = 'selected';
            mestitulo = 'Março'
            break;
        case 04: abril = 'selected';
            mestitulo = 'Abril'
            break;
        case 05: maio = 'selected';
            mestitulo = 'Maio'
            break;
        case 06: junho = 'selected';
            mestitulo = 'Junho'
            break;
        case 07: julho = 'selected';
            mestitulo = 'Julho'
            break;
        case 08: agosto = 'selected';
            mestitulo = 'Agosto'
            break;
        case 09: setembro = 'selected';
            mestitulo = 'Setembro'
            break;
        case 10: outubro = 'selected';
            mestitulo = 'Outubro'
            break;
        case 11: novembro = 'selected';
            mestitulo = 'Novembro'
            break;
        case 12: dezembro = 'selected';
            mestitulo = 'Dezembro'
            break;
    }

    //console.log('mestitulo=>' + mestitulo)

    Cliente.find({ user: _id }).lean().then((cliente) => {
        // res.render('projeto/gerenciamento/agenda', { cliente, ano, mes, mestitulo, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, checkInst: 'checked', checkTesk: 'unchecked' })
        res.render('projeto/gerenciamento/agenda', { cliente, ano, mes, mestitulo, janeiro, fevereiro, marco, abril, maio, junho, julho, agosto, setembro, outubro, novembro, dezembro, checkTesk: 'checked' })
    })
})

router.get('/tarefas/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    Tarefas.findOne({ _id: req.params.id }).lean().then((tarefa) => {
        Usina.findOne({ _id: tarefa.usina }).lean().then((usina) => {
            //console.log('usina.cliente=>' + usina.cliente)
            Cliente.findOne({ _id: usina.cliente }).lean().then((cliente) => {
                //console.log('encontrou cliente')
                var dataini = dataMensagem(tarefa.dataini)
                var datafim = dataMensagem(tarefa.datafim)
                Equipe.findOne({ tarefa: tarefa._id }).then((equipe) => {
                    equipe = equipe.ins0 + '|' + equipe.ins1 + '|' + equipe.ins2 + '|' + equipe.ins3 + '|' + equipe.ins4 + '|' + equipe.ins5
                    Tarefas.find({ user: _id, concluido: false }).lean().then((todasTarefas) => {
                        res.render('projeto/gerenciamento/vertarefas', { usina, tarefa, cliente, dataini, datafim, equipe, todasTarefas })
                    }).catch((err) => {
                        req.flash('error_msg', 'Falha ao encontrar as tarefas.')
                        res.redirect('/gerenciamento/agenda')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Falha ao encontrar a equipe.')
                    res.redirect('/gerenciamento/agenda')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao encontrar o cliente.')
                res.redirect('/gerenciamento/agenda')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar a usina.')
            res.redirect('/gerenciamento/agenda')
        })

    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar a tarefa.')
        res.redirect('/gerenciamento/agenda')
    })
})

router.get('/plano', ehAdmin, (req, res) => {
    res.render('projeto/gerenciamento/planos')
})

router.get('/plano/:id', ehAdmin, (req, res) => {
    Plano.findOne({ _id: req.params.id }).lean().then((plano) => {
        res.render('projeto/gerenciamento/planos', { plano })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar o plano.')
        res.redirect('/gerenciamento/agenda')
    })
})

router.get('/consultaplano', ehAdmin, (req, res) => {
    const { _id } = req.user
    Plano.find({ user: _id }).lean().then((planos) => {
        res.render('projeto/gerenciamento/consultaplano', { planos })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar o plano.')
        res.redirect('/gerenciamento/plano')
    })
})

router.post('/trt', ehAdmin, (req, res) => {
    const { _id } = req.user
    var trtfile
    var upload = multer({ storage }).single('trt')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            console.log('req.file=>' + req.file)
            if (req.file != null) {
                trtfile = req.file.filename
            } else {
                trtfile = ''
            }

            Documento.findOne({ proposta: req.body.id }).then((documento) => {
                console.log()
                if (documento != null) {
                    console.log('entrou')
                    documento.trt = trtfile
                    documento.dttrt = String(req.body.dttrt)
                } else {
                    const trt = {
                        user: _id,
                        proposta: req.body.id,
                        trt: trtfile,
                        dttrt: String(req.body.dttrt),
                        data: dataBusca(dataHoje()),
                        feitotrt: true
                    }
                    new Documento(trt).save().then(() => {
                        req.flash('success_msg', 'TRT salvo com sucesso')
                        res.redirect('/gerenciamento/trt/' + req.body.id)
                    })
                }
            })
        }
    })
})

router.get('/mostrarTrt/:id', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.params.id }).then((documento) => {
        var doc = documento.trt
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta1', ehAdmin, (req, res) => {
    const { _id } = req.user
    var propostafile
    var upload = multer({ storage }).single('proposta1')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            console.log('req.file=>' + req.file)
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }

            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                if (proposta != null) {
                    proposta.cliente = req.body.cliente
                    proposta.responsavel = req.body.responsavel
                    proposta.proposta1 = String(propostafile)
                    proposta.dtcadastro1 = String(req.body.dtcadastro1)
                    proposta.dtvalidade1 = String(req.body.dtvalidade1)
                    proposta.data = dataBusca(dataHoje())
                } else {
                    const proposta1 = {
                        user: _id,
                        cliente: req.body.cliente,
                        responsavel: req.body.responsavel,
                        proposta1: String(propostafile),
                        dtcadastro1: String(req.body.dtcadastro1),
                        dtvalidade1: String(req.body.dtvalidade1),
                        data: dataBusca(dataHoje()),
                        feito: true
                    }
                    new Proposta(proposta1).save().then(() => {
                        Proposta.findOne().sort({ field: 'asc', _id: -1 }).then((nova_proposta) => {
                            Cliente.findOne({ _id: nova_proposta.cliente }).then((cliente) => {
                                new Equipe({
                                    user: _id,
                                    nome_projeto: cliente.nome,
                                }).save().then(() => {
                                    Equipe.findOne().sort({ field: 'asc', _id: -1 }).then((nova_equipe) => {
                                        console.log('nova_proposta._id=>' + nova_proposta._id)
                                        console.log('nova_equipe._id=>' + nova_equipe._id)
                                        nova_proposta.equipe = nova_equipe._id
                                        nova_proposta.save().then(() => {
                                            new Vistoria({
                                                proposta: nova_proposta._id
                                            }).save().then(() => {
                                                new Compra({
                                                    proposta: nova_proposta._id
                                                }).save().then(() => {
                                                    new Documento({
                                                        proposta: nova_proposta._id
                                                    }).save((then) => {
                                                        req.flash('success_msg', 'Proposta salva com sucesso')
                                                        res.redirect('/gerenciamento/proposta/' + nova_proposta._id)
                                                    })
                                                })
                                            })

                                        })
                                    })
                                })
                            })
                        })

                    })
                }
            })
        }
    })
})

router.get('/mostrarProposta1/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta1
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta2', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('proposta2')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.proposta2 = propostafile
                proposta.dtcadastro2 = String(req.body.dtcadastro2)
                proposta.dtvalidade2 = String(req.body.dtvalidade2)
                proposta.data = dataBusca(dataHoje())
                proposta.save().then(() => {
                    req.flash('success_msg', 'Proposta salva com sucesso')
                    res.redirect('/gerenciamento/proposta/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarProposta2/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta2
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta3', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('proposta3')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.proposta3 = propostafile
                proposta.dtcadastro3 = String(req.body.dtcadastro3)
                proposta.dtvalidade3 = String(req.body.dtvalidade3)
                proposta.data = dataBusca(dataHoje())
                proposta.save().then(() => {
                    req.flash('success_msg', 'Proposta salva com sucesso')
                    res.redirect('/gerenciamento/proposta/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarProposta3/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta3
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta4', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('proposta4')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.proposta4 = propostafile
                proposta.dtcadastro4 = String(req.body.dtcadastro4)
                proposta.dtvalidade4 = String(req.body.dtvalidade4)
                proposta.data = dataBusca(dataHoje())
                proposta.save().then(() => {
                    req.flash('success_msg', 'Proposta salva com sucesso')
                    res.redirect('/gerenciamento/proposta/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarProposta4/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta4
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta5', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('proposta5')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.proposta5 = propostafile
                proposta.dtcadastro5 = String(req.body.dtcadastro5)
                proposta.dtvalidade5 = String(req.body.dtvalidade5)
                proposta.data = dataBusca(dataHoje())
                proposta.save().then(() => {
                    req.flash('success_msg', 'Proposta salva com sucesso')
                    res.redirect('/gerenciamento/proposta/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarProposta5/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta5
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/proposta6', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('proposta6')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.proposta6 = propostafile
                proposta.dtcadastro6 = String(req.body.dtcadastro6)
                proposta.dtvalidade6 = String(req.body.dtvalidade6)
                proposta.data = dataBusca(dataHoje())
                proposta.save().then(() => {
                    req.flash('success_msg', 'Proposta salva com sucesso')
                    res.redirect('/gerenciamento/proposta/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarProposta6/:id', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.proposta6
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.get('/mostrarProposta/:id', ehAdmin, (req, res) => {

    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        var doc = proposta.assinatura
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/visita', ehAdmin, (req, res) => {

    const { _id } = req.user

    Vistoria.findOne({ proposta: req.body.id }).then((vistoria) => {
        // console.log('vistoria=>' + vistoria)
        if (vistoria != '' && typeof vistoria != 'undefined' && vistoria != null) {
            vistoria.plaQtdMod = req.body.plaQtdMod
            vistoria.plaWattMod = req.body.plaWattMod
            vistoria.plaQtdInv = req.body.plaQtdInv
            vistoria.plaKwpInv = req.body.plaKwpInv
            vistoria.plaDimArea = req.body.plaDimArea
            vistoria.plaQtdString = req.body.plaQtdString
            vistoria.plaModString = req.body.plaModString
            vistoria.plaQtdEst = req.body.plaQtdEst
            vistoria.feito = true
            vistoria.save().then(() => {
                req.flash('success_msg', 'Vistoria salva com sucesso.')
                res.redirect('/gerenciamento/visita/' + req.body.id)
            })
        } else {
            const vistoria = {
                user: _id,
                proposta: req.body.id,
                plaQtdMod: req.body.plaQtdMod,
                plaWattMod: req.body.plaWattMod,
                plaQtdInv: req.body.plaQtdInv,
                plaKwpInv: req.body.plaKwpInv,
                plaDimArea: req.body.plaDimArea,
                plaQtdString: req.body.plaQtdString,
                plaModString: req.body.plaModString,
                plaQtdEst: req.body.plaQtdEst,
                feito: true
            }
            new Vistoria(vistoria).save().then(() => {

                req.flash('success_msg', 'Vistoria salva com sucesso.')
                res.redirect('/gerenciamento/visita/' + req.body.id)

            })
        }
    })
})

router.post('/assinatura', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('assinado')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Proposta.findOne({ _id: req.body.id }).then((proposta) => {
                proposta.assinatura = propostafile
                proposta.dtassinatura = String(req.body.dtassinado)
                proposta.assinado = true
                proposta.save().then(() => {
                    req.flash('success_msg', 'Documento salvo com sucesso.')
                    res.redirect('/gerenciamento/assinatura/' + req.body.id)
                })
            })
        }
    })
})

router.post('/pedido', ehAdmin, (req, res) => {
    const { _id } = req.user
    var propostafile
    var upload = multer({ storage }).single('pedido')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Compra.findOne({ _id: req.body.id }).then((compra) => {
                console.log('compra=>' + compra)
                if (compra == null) {
                    const pedido = {
                        user: _id,
                        fornecedor: req.body.fornecedor,
                        proposta: req.body.id,
                        pedido: propostafile,
                        dtcadastro: String(req.body.dtcadastro),
                        feitopedido: true,
                        data: dataBusca(dataHoje())
                    }
                    new Compra(pedido).save().then(() => {
                        req.flash('success_msg', 'Pedido salvo com sucesso.')
                        res.redirect('/gerenciamento/compra/' + req.body.id)
                    })
                } else {
                    compra.pedido = propostafile
                    compra.dtcadastro = String(req.body.dtcadastro)
                    compra.save().then(() => {
                        req.flash('success_msg', 'Documento salvo com sucesso.')
                        res.redirect('/gerenciamento/compra/' + req.body.id)
                    })
                }
            })
        }
    })
})

router.get('/mostrarPedido/:id', ehAdmin, (req, res) => {
    Compra.findOne({ proposta: req.params.id }).then((compra) => {
        var doc = compra.pedido
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/nota', ehAdmin, (req, res) => {
    var propostafile
    var upload = multer({ storage }).single('nota')
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else {
            if (req.file != null) {
                propostafile = req.file.filename
            } else {
                propostafile = ''
            }
            Compra.findOne({ proposta: req.body.id }).then((compra) => {
                compra.nota = propostafile
                compra.dtrecebimento = String(req.body.dtrecebimento)
                compra.feitonota = true
                compra.save().then(() => {
                    req.flash('success_msg', 'Nota salva com sucesso.')
                    res.redirect('/gerenciamento/compra/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarNota/:id', ehAdmin, (req, res) => {
    Compra.findOne({ proposta: req.params.id }).then((compra) => {
        var doc = compra.nota
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/salvarpadrao', ehAdmin, (req, res) => {
    Proposta.findOne({ _id: req.body.id }).then((proposta) => {
        Equipe.findOne({ _id: req.body.equipe }).then((equipe) => {
            Equipe.findOne({ _id: proposta.equipe }).then((equipe_prj) => {
                equipe_prj.nome_equipe = equipe.nome
                equipe_prj.ins0 = equipe.ins0
                equipe_prj.ins1 = equipe.ins1
                equipe_prj.ins2 = equipe.ins2
                equipe_prj.ins3 = equipe.ins3
                equipe_prj.ins4 = equipe.ins4
                equipe_prj.ins5 = equipe.ins5
                equipe_prj.save().then(() => {
                    res.redirect('/gerenciamento/equipe/' + req.body.id)
                }).catch((err) => {
                    req.flash('error_msg', 'Houve erro ao salvar a equipe.')
                    res.redirect('/gerenciamento/equipe/' + req.body.id)
                })
            }).catch((err) => {
                req.flash('error_msg', 'Houve erro ao encontrar a equipe<tem equipe>.')
                res.redirect('/gerenciamento/equipe/' + req.body.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve erro ao encontrar a equipe.')
            res.redirect('/gerenciamento/equipe/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve erro ao encontrar o projeto.')
        res.redirect('/gerenciamento/equipe/' + req.body.id)
    })
})

router.post("/salvarequipe", ehAdmin, (req, res) => {

    Proposta.findOne({ _id: req.body.id }).then((proposta) => {
        Equipe.findOne({ _id: proposta.equipe }).then((equipe) => {
            equipe.ins0 = req.body.ins0
            equipe.ins1 = req.body.ins1
            equipe.ins2 = req.body.ins2
            equipe.ins3 = req.body.ins3
            equipe.ins4 = req.body.ins4
            equipe.ins5 = req.body.ins5
            equipe.dtinicio = req.body.dtinicio
            equipe.dtfim = req.body.dtfim
            equipe.feito = true
            equipe.save().then(() => {

                res.redirect('/gerenciamento/equipe/' + req.body.id)

            }).catch((err) => {
                req.flash('error_msg', 'Houve erro ao salvar a equipe.')
                res.redirect('/gerenciamento/equipe/' + req.body.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve erro ao encontrar a equipe.')
            res.redirect('/gerenciamento/equipe/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve erro ao encontrar a proposta.')
        res.redirect('/gerenciamento/equipe/' + req.body.id)
    })
})

router.get('/enviarequipe/:id', ehAdmin, (req, res) => {
    var liberar
    var mensagem
    var tipo
    Proposta.findOne({ _id: req.params.id }).then((proposta) => {
        Equipe.findOne({ _id: proposta.equipe }).then((equipe) => {
            if (equipe.liberar == true) {
                liberar = false
                mensagem = 'Envio cancelado.'
                tipo = 'error_msg'
            } else {
                liberar = true
                mensagem = 'Equipe liberada para a obra.'
                tipo = 'success_msg'
            }
            equipe.liberar = liberar
            equipe.save().then(() => {
                req.flash(tipo, mensagem)
                res.redirect('/gerenciamento/equipe/' + req.params.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve erro ao encontrar a equipe.')
            res.redirect('/gerenciamento/equipe/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve erro ao encontrar a proposta.')
        res.redirect('/gerenciamento/equipe/' + req.body.id)
    })
})

router.post('/salvarMemorial', ehAdmin, (req, res) => {
    var memorialfile
    var upload = multer({ storage }).single('memorial')
    upload(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file.')
        } else {
            if (req.file != null) {
                memorialfile = req.file.filename
            } else {
                memorialfile = ''
            }

            Documento.findOne({ proposta: req.body.id }).then((documento) => {
                documento.memorial = memorialfile
                documento.dtmemorial = req.body.dtmemorial
                documento.save().then(() => {
                    req.flash('success_msg', 'Memorial descritivo salvo com sucesso.')
                    res.redirect('/gerenciamento/execucao/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarMesmorial/:id', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.params.id }).then((documento) => {
        var doc = documento.memorial
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/salvarSituacao', ehAdmin, (req, res) => {
    var situacaofile
    var upload = multer({ storage }).single('situacao')
    upload(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file.')
        } else {
            if (req.file != null) {
                situacaofile = req.file.filename
            } else {
                situacaofile = ''
            }
            Documento.findOne({ proposta: req.body.id }).then((documento) => {
                console.log('situacaofile=>' + situacaofile)
                documento.situacao = situacaofile
                documento.dtsituacao = req.body.dtsituacao
                documento.save().then(() => {
                    req.flash('success_msg', 'Plano de situação salvo com sucesso.')
                    res.redirect('/gerenciamento/execucao/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarSituacao/:id', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.params.id }).then((documento) => {
        var doc = documento.situacao
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/salvarTrifilar', ehAdmin, (req, res) => {
    var trifilarfile
    var upload = multer({ storage }).single('trifilar')
    upload(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file.')
        } else {
            if (req.file != null) {
                trifilarfile = req.file.filename
            } else {
                trifilarfile = ''
            }
            Documento.findOne({ proposta: req.body.id }).then((documento) => {
                documento.trifilar = trifilarfile
                documento.dttrifilar = req.body.dttrifilar
                documento.save().then(() => {
                    req.flash('success_msg', 'Diagrama trifilar salvo com sucesso.')
                    res.redirect('/gerenciamento/execucao/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarTrifilar/:id', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.params.id }).then((documento) => {
        var doc = documento.trifilar
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/salvarUnifilar', ehAdmin, (req, res) => {
    var unifilarfile
    var upload = multer({ storage }).single('unifilar')
    upload(req, res, function (err) {
        if (err) {
            return res.end('Error uploading file.')
        } else {
            if (req.file != null) {
                unifilarfile = req.file.filename
            } else {
                unifilarfile = ''
            }
            Documento.findOne({ proposta: req.body.id }).then((documento) => {
                documento.unifilar = unifilarfile
                documento.dtunifilar = req.body.dtunifilar
                documento.save().then(() => {
                    req.flash('success_msg', 'Diagrama unifilar salvo com sucesso.')
                    res.redirect('/gerenciamento/execucao/' + req.body.id)
                })
            })
        }
    })
})

router.get('/mostrarUnifilar/:id', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.params.id }).then((documento) => {
        var doc = documento.unifilar
        var path = __dirname
        //console.log(path)
        path = path.replace('routes', '')
        res.sendFile(path + '/public/arquivos/' + doc)
    })
})

router.post('/protocolar', ehAdmin, (req, res) => {
    Documento.findOne({ proposta: req.body.id }).then((documento) => {
        var valida = new Date()
        var date = new Date(req.body.dtprotocolo)
        valida.setDate(date.getDate() + 14)
        console.log('valida=>' + valida)
        documento.protocolado = true
        documento.dtprotocolo = req.body.dtprotocolo
        var dia = valida.getDate()
        if (parseFloat(dia) < 10) {
            dia = '0' + dia
        }
        var mes = valida.getMonth()
        if ((31 - parseFloat(date.getDate()) < 14)) {
            mes = parseFloat(mes) + 1
        }
        if (parseFloat(mes) < 10) {
            mes = '0' + mes
        }
        var ano = valida.getFullYear()
        var valida = dia + '/' + mes + '/' + ano
        console.log('valida=>' + valida)
        documento.dtdeadline = valida
        documento.save().then(() => {
            req.flash('success_msg', 'Projeto homologado na concessionária.')
            res.redirect('/gerenciamento/execucao/' + req.body.id)
        })
    })
})

router.post('/plano', ehAdmin, (req, res) => {
    const { _id } = req.user
    var fidelidade
    if (req.body.fidelidade == '' || typeof req.body.fidelidade == 'undefined') {
        fidelidade = 0
    } else {
        fidelidade = req.body.fidelidade
    }
    //console.log('id=>' + req.body.id)
    //console.log('fidelidade=>' + req.body.fidelidade)
    if (req.body.id != '' && typeof req.body.id != 'undefined') {
        Plano.findOne({ _id: req.body.id }).then((existeplano) => {
            existeplano.nome = req.body.nome
            existeplano.qtdini = req.body.qtdini
            existeplano.qtdfim = req.body.qtdfim
            existeplano.mensalidade = req.body.mensalidade
            existeplano.fidelidade = fidelidade
            existeplano.save().then(() => {
                req.flash('success_msg', 'Plano salvo com sucesso.')
                res.redirect('/gerenciamento/plano/' + req.body.id)
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao salvar o plano.')
                res.redirect('/gerenciamento/plano')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar o plano.')
            res.redirect('/gerenciamento/plano')
        })
    } else {
        //console.log('novo plano')
        new Plano({
            user: _id,
            nome: req.body.nome,
            qtdini: req.body.qtdini,
            qtdfim: req.body.qtdfim,
            mensalidade: req.body.mensalidade,
            fidelidade: fidelidade,
        }).save().then(() => {
            Plano.findOne().sort({ field: 'asc', _id: -1 }).lean().then((novoplano) => {
                req.flash('success_msg', 'Plano salvo com sucesso.')
                res.redirect('/gerenciamento/plano/' + novoplano._id)
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao encontrar o plano.')
                res.redirect('/gerenciamento/plano')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao salvar o plano.')
            res.redirect('/gerenciamento/plano')
        })
    }
})

router.get('/enviaMensagem/:id', ehAdmin, (req, res) => {

    Projeto.findOne({ _id: req.params.id }).then((projeto) => {
        Cliente.findOne({ _id: projeto.cliente }).then((cliente) => {
            Cronograma.findOne({ projeto: projeto._id }).then((cronograma) => {
                Empresa.findOne({ _id: projeto.empresa }).then((empresa) => {
                    var telefone = empresa.telefone
                    var ddd = telefone.substring(0, 2)
                    var primdig = telefone.substring(2, 6)
                    var segdig = telefone.substring(6, 12)
                    telefone = '(' + ddd + ') ' + primdig + ' - ' + segdig
                    //Enviando SMS                              
                    var mensagem = 'Olá ' + cliente.nome + ', tudo bem?' + '\n' +
                        'Segue o cronograma para a instalação de sua usina solar: ' + '\n' +
                        'Planejamento: ' + dataMensagem(cronograma.dateplaini) + ' a ' + dataMensagem(cronograma.dateplafim) + '\n' +
                        'Projetista: ' + dataMensagem(cronograma.dateprjini) + ' a ' + dataMensagem(cronograma.dateprjfim) + '\n' +
                        'Aterramento: ' + dataMensagem(cronograma.dateateini) + ' a ' + dataMensagem(cronograma.dateatefim) + '\n' +
                        'Inversores e StringBox: ' + dataMensagem(cronograma.dateinvini) + ' a ' + dataMensagem(cronograma.datestbfim) + '\n' +
                        'Instalação da Estrutura: ' + dataMensagem(cronograma.dateestini) + ' a ' + dataMensagem(cronograma.dateestfim) + '\n' +
                        'Instalação dos Módulos: ' + dataMensagem(cronograma.datemodini) + ' a ' + dataMensagem(cronograma.datemodfim) + '\n' +
                        'Vistoria: ' + dataMensagem(cronograma.datevisini) + ' a ' + dataMensagem(cronograma.datevisfim) + '.' + '\n' +
                        'Para mais detalhes entre em contato com a gente pelo whatsapp:' + telefone

                    //console.log(mensagem)
                    to = cliente.celular
                    //console.log(to)

                    //console.log('cliente.email=>' + cliente.email)

                    var email = cliente.email

                    const mailOptions = { // Define informações pertinentes ao E-mail que será enviado
                        from: '"VIMMUS Soluções" <alexandre@vimmus.com.br>',
                        to: email,
                        subject: 'Cronograma do Projeto de Instalação do Sistema Fotovoltaico',
                        //text: 'Nome: ' + req.body.nome + ';' + 'Celular: ' + req.body.celular + ';' + 'E-mail: '+ req.body.email
                        text: mensagem
                    }

                    var textMessageService = new TextMessageService(apiKey)
                    textMessageService.send('Vimmus', mensagem, ['49991832978'], result => {
                        //console.log(result)
                        if (result == false) {
                            req.flash('error_msg', 'Falha interna. Não foi possível enviar a mensagem.')
                            res.redirect('/gerenciamento/cronograma/' + req.params.id)
                        } else {
                            projeto.mensagem = true
                            projeto.save().then(() => {
                                req.flash('success_msg', 'Mensagem enviada para: ' + cliente.nome + ' com sucesso.')
                                transporter.sendMail(mailOptions, (err, info) => { // Função que, efetivamente, envia o email.
                                    if (err) {
                                        return //console.log(err)
                                    } else {
                                        res.redirect('/gerenciamento/cronograma/' + req.params.id)
                                    }
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Falha ao salvar o projeto.')
                                res.redirect('/gerenciamento/cronograma/' + req.params.id)
                            })
                        }
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Falha ao encontrar a empresa.')
                    res.redirect('/gerenciamento/cronograma/' + req.params.id)
                })
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao encontrar o cronograma.')
                res.redirect('/gerenciamento/cronograma/' + req.params.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar o cliente.')
            res.redirect('/gerenciamento/cronograma/' + req.params.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar o projeto.')
        res.redirect('/gerenciamento/cronograma/' + req.params.id)
    })

})

router.post('/aplicaAgenda/', ehAdmin, (req, res) => {
    const { _id } = req.user
    var ano = req.body.mesano

    switch (req.body.messel) {
        case 'Janeiro':
            dataini = ano + '01' + '01'
            datafim = ano + '01' + '31'
            mestitulo = 'Janeiro '
            break;
        case 'Fevereiro':
            dataini = ano + '02' + '01'
            datafim = ano + '02' + '28'
            mestitulo = 'Fevereiro '
            break;
        case 'Março':
            dataini = ano + '03' + '01'
            datafim = ano + '03' + '31'
            mestitulo = 'Março /'
            break;
        case 'Abril':
            dataini = ano + '04' + '01'
            datafim = ano + '04' + '30'
            mestitulo = 'Abril '
            break;
        case 'Maio':
            dataini = ano + '05' + '01'
            datafim = ano + '05' + '31'
            mestitulo = 'Maio '
            break;
        case 'Junho':
            dataini = ano + '06' + '01'
            datafim = ano + '06' + '30'
            mestitulo = 'Junho '
            break;
        case 'Julho':
            dataini = ano + '07' + '01'
            datafim = ano + '07' + '31'
            mestitulo = 'Julho '
            break;
        case 'Agosto':
            dataini = ano + '08' + '01'
            datafim = ano + '08' + '30'
            mestitulo = 'Agosto '
            break;
        case 'Setembro':
            dataini = ano + '09' + '01'
            datafim = ano + '09' + '31'
            mestitulo = 'Setembro '
            break;
        case 'Outubro':
            dataini = ano + '10' + '01'
            datafim = ano + '10' + '31'
            mestitulo = 'Outubro '
            break;
        case 'Novembro':
            dataini = ano + '11' + '01'
            datafim = ano + '11' + '30'
            mestitulo = 'Novembro '
            break;
        case 'Dezembro':
            dataini = ano + '12' + '01'
            datafim = ano + '12' + '31'
            mestitulo = 'Dezembro '
            break;
        default:
            dataini = ano + '01' + '01'
            datafim = ano + '12' + '31'
            mestitulo = 'Todo ano '
    }
    var tarefas01 = []
    var tarefas02 = []
    var tarefas03 = []
    var tarefas04 = []
    var tarefas05 = []
    var tarefas06 = []
    var tarefas07 = []
    var tarefas08 = []
    var tarefas09 = []
    var tarefas10 = []
    var tarefas11 = []
    var tarefas12 = []
    var tarefas13 = []
    var tarefas14 = []
    var tarefas15 = []
    var tarefas16 = []
    var tarefas17 = []
    var tarefas18 = []
    var tarefas19 = []
    var tarefas20 = []
    var tarefas21 = []
    var tarefas22 = []
    var tarefas23 = []
    var tarefas24 = []
    var tarefas25 = []
    var tarefas26 = []
    var tarefas27 = []
    var tarefas28 = []
    var tarefas29 = []
    var tarefas30 = []
    var tarefas31 = []

    var dia
    var mes_busca
    var mes
    console.log('req.body.selecionado=>' + req.body.selecionado)
    console.log('dataini=>' + dataini)
    console.log('datafim=>' + datafim)
    if (req.body.selecionado == 'instalacao') {
        Cronograma.find({
            $or: [{ 'agendaPlaFim': { $lte: datafim, $gte: dataini } },
            { 'agendaPrjFim': { $lte: datafim, $gte: dataini } },
            { 'agendaAteFim': { $lte: datafim, $gte: dataini } },
            { 'agendaEstFim': { $lte: datafim, $gte: dataini } },
            { 'agendaModFim': { $lte: datafim, $gte: dataini } },
            { 'agendaInsFim': { $lte: datafim, $gte: dataini } },
            { 'agendaStbFim': { $lte: datafim, $gte: dataini } },
            { 'agendaPnlFim': { $lte: datafim, $gte: dataini } },
            { 'agendaEaeFim': { $lte: datafim, $gte: dataini } },
            { 'agendaVisFim': { $lte: datafim, $gte: dataini } }],
            user: _id
        }).lean().then((cronograma) => {
            console.log('cronograma.length=>' + cronograma.length)
            cronograma.forEach(element => {
                console.log('entrou')
                const { dateplaini } = element
                const { dateprjini } = element
                const { dateateini } = element
                const { dateestini } = element
                const { datemodini } = element
                const { dateinvini } = element
                const { dateeaeini } = element
                const { datepnlini } = element
                const { datestbini } = element
                const { datevisini } = element
                const { datepla } = element
                const { dateprj } = element
                const { dateate } = element
                const { dateest } = element
                const { datemod } = element
                const { dateinv } = element
                const { dateeae } = element
                const { datestb } = element
                const { datepnl } = element
                const { datevis } = element
                const { nome } = element
                const { projeto } = element

                //console.log('nome=>' + nome)

                if (nome != '' && typeof nome != 'undefined') {
                    //console.log('projeto=>' + projeto)

                    mes_busca = dataini.substring(4, 6)
                    //console.log('mes_busca=>' + mes_busca)
                    mes = dateplaini.substring(5, 7)
                    //console.log('Planejamento')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (dateplaini != '' && typeof dateplaini != 'undefined') && (datepla == '' || typeof datepla == 'undefined')) {
                        dia = dateplaini.substring(8, 11)
                        console.log('entrou Planejamento')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Planejamento' })
                        }
                    }

                    mes = dateprjini.substring(5, 7)
                    console.log('Projetista')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (dateprjini != '' && typeof dateprjini != 'undefined') && (dateprj == '' || typeof dateprj == 'undefined')) {
                        dia = dateprjini.substring(8, 11)
                        //console.log('entrou Projetista')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Projetista' })
                        }
                    }

                    mes = dateateini.substring(5, 7)
                    //console.log('Aterramento')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (dateateini != '' && typeof dateateini != 'undefined') && (dateate == '' || typeof dateate == 'undefined')) {
                        dia = dateateini.substring(8, 11)
                        console.log('entrou Aterramento')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Aterramento' })
                        }
                    }

                    mes = dateestini.substring(5, 7)
                    //console.log('Estrutura')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (dateestini != '' && typeof dateestini != 'undefined') && (dateest == '' || typeof dateest == 'undefined')) {
                        dia = dateestini.substring(8, 11)
                        console.log('entrou Estrutura')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Estrutura' })
                        }
                    }

                    mes = dateinvini.substring(5, 7)
                    //console.log('Inversor')
                    //console.log('mes=>' + mes)
                    //console.log('dateinv=>' + dateinv)
                    //console.log('dateinvini=>' + dateinvini)
                    if ((mes_busca == mes) && (dateinvini != '' && typeof dateinvini != 'undefined') && (dateinv == '' || typeof dateinv == 'undefined')) {
                        dia = dateinvini.substring(8, 11)
                        console.log('entrou Inversor')
                        //console.log('nome=>' + nome)
                        //console.log('projeto=>' + projeto)

                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                        }
                    }

                    if (dateeaeini != '' && typeof dateeaeini != 'undefined') {
                        mes = dateeaeini.substring(5, 7)
                        console.log('Armazenamento')
                        //console.log('mes=>' + mes)
                        //console.log('dateeae=>' + dateeae)
                        //console.log('dateeaeini=>' + dateeaeini)
                        if ((mes_busca == mes) && (dateeae == '' || typeof dateeae == 'undefined')) {
                            dia = dateeaeini.substring(8, 11)
                            //console.log('Entrou Armazenamento')
                            if (dia == '01') {
                                tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '02') {
                                tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '03') {
                                tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '04') {
                                tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '05') {
                                tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '06') {
                                tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '07') {
                                tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '08') {
                                tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '09') {
                                tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '10') {
                                tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '11') {
                                tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '12') {
                                tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '13') {
                                tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '14') {
                                tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '15') {
                                tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '16') {
                                tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '17') {
                                tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '18') {
                                tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '19') {
                                tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '20') {
                                tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '21') {
                                tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '22') {
                                tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '23') {
                                tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '24') {
                                tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '25') {
                                tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '26') {
                                tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '27') {
                                tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '28') {
                                tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '29') {
                                tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '30') {
                                tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                            if (dia == '31') {
                                tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Inversor(es)' })
                            }
                        }
                    }
                    mes = datestbini.substring(5, 7)
                    //console.log('StringBox')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (datestbini != '' && typeof datestbini != 'undefined') && (datestb == '' || typeof datestb == 'undefined')) {
                        dia = datestbini.substring(8, 11)
                        //console.log('Entrou StringBox')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Stringbox' })
                        }
                    }
                    mes = datemodini.substring(5, 7)
                    //console.log('Modulos')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (datemodini != '' && typeof datemodini != 'undefined') && (datemod == '' || typeof datemod == 'undefined')) {
                        dia = datemodini.substring(8, 11)
                        //console.log('Entrou Modulos')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Módulos' })
                        }
                    }
                    if (datepnlini != '' && typeof datepnlini != 'undefined') {
                        mes = datepnlini.substring(5, 7)
                        //console.log('Painel')
                        //console.log('mes=>' + mes)
                        if ((mes_busca == mes) && (datepnl == '' || typeof datepnl == 'undefined')) {
                            dia = datepnlini.substring(8, 11)
                            //console.log('Entrou Painel')
                            if (dia == '01') {
                                tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '02') {
                                tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '03') {
                                tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '04') {
                                tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '05') {
                                tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '06') {
                                tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '07') {
                                tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '08') {
                                tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '09') {
                                tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '10') {
                                tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '11') {
                                tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '12') {
                                tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '13') {
                                tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '14') {
                                tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '15') {
                                tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '16') {
                                tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '17') {
                                tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '18') {
                                tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '19') {
                                tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '20') {
                                tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '21') {
                                tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '22') {
                                tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '23') {
                                tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '24') {
                                tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '25') {
                                tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '26') {
                                tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '27') {
                                tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '28') {
                                tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '29') {
                                tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '30') {
                                tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                            if (dia == '31') {
                                tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Painél Elétrico' })
                            }
                        }
                    }
                    mes = datevisini.substring(5, 7)
                    //console.log('Vistoria')
                    //console.log('mes=>' + mes)
                    if ((mes_busca == mes) && (datevisini != '' && typeof datevisini != 'undefined') && (datevis == '' || typeof datevis == 'undefined')) {
                        dia = datevisini.substring(8, 11)
                        console.log('Entrou Vistoria')
                        if (dia == '01') {
                            tarefas01.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '02') {
                            tarefas02.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '03') {
                            tarefas03.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '04') {
                            tarefas04.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '05') {
                            tarefas05.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '06') {
                            tarefas06.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '07') {
                            tarefas07.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '08') {
                            tarefas08.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '09') {
                            tarefas09.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '10') {
                            tarefas10.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '11') {
                            tarefas11.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '12') {
                            tarefas12.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '13') {
                            tarefas13.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '14') {
                            tarefas14.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '15') {
                            tarefas15.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '16') {
                            tarefas16.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '17') {
                            tarefas17.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '18') {
                            tarefas18.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '19') {
                            tarefas19.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '20') {
                            tarefas20.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '21') {
                            tarefas21.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '22') {
                            tarefas22.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '23') {
                            tarefas23.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '24') {
                            tarefas24.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '25') {
                            tarefas25.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '26') {
                            tarefas26.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '27') {
                            tarefas27.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '28') {
                            tarefas28.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '29') {
                            tarefas29.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '30') {
                            tarefas30.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                        if (dia == '31') {
                            tarefas31.push({ projeto: nome, id: projeto, tarefa: 'Vistoria' })
                        }
                    }
                }
            })

            console.log('tarefas1=>' + tarefas01)
            console.log('tarefas2=>' + tarefas02)
            console.log('tarefas3=>' + tarefas03)
            console.log('tarefas4=>' + tarefas04)
            console.log('tarefas5=>' + tarefas05)
            console.log('tarefas6=>' + tarefas06)
            console.log('tarefas7=>' + tarefas07)
            console.log('tarefas8=>' + tarefas08)
            console.log('tarefas9=>' + tarefas09)
            console.log('tarefas10=>' + tarefas10)
            console.log('tarefas11=>' + tarefas11)
            console.log('tarefas12=>' + tarefas12)
            console.log('tarefas13=>' + tarefas13)
            console.log('tarefas14=>' + tarefas14)
            console.log('tarefas15=>' + tarefas15)
            console.log('tarefas16=>' + tarefas16)
            console.log('tarefas17=>' + tarefas17)
            console.log('tarefas18=>' + tarefas18)
            console.log('tarefas19=>' + tarefas19)
            console.log('tarefas20=>' + tarefas20)
            console.log('tarefas21=>' + tarefas21)
            console.log('tarefas22=>' + tarefas22)
            console.log('tarefas23=>' + tarefas23)
            console.log('tarefas24=>' + tarefas24)
            console.log('tarefas25=>' + tarefas25)
            console.log('tarefas26=>' + tarefas26)
            console.log('tarefas27=>' + tarefas27)
            console.log('tarefas28=>' + tarefas28)
            console.log('tarefas29=>' + tarefas29)
            console.log('tarefa30=>' + tarefas30)
            console.log('tarefa31=>' + tarefas31)

            Cliente.find({ user: _id }).lean().then((cliente) => {
                res.render('projeto/gerenciamento/agenda', {
                    tarefas01, tarefas02, tarefas03, tarefas04, tarefas05, tarefas06, tarefas07,
                    tarefas08, tarefas09, tarefas10, tarefas11, tarefas12, tarefas13, tarefas14,
                    tarefas15, tarefas16, tarefas17, tarefas18, tarefas19, tarefas20, tarefas21,
                    tarefas22, tarefas23, tarefas24, tarefas25, tarefas26, tarefas27, tarefas28,
                    tarefas29, tarefas30, tarefas31, checkTesk: 'unchecked', checkInst: 'checked',
                    mes: req.body.messel, ano, cliente, mestitulo
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                res.redirect('/gerenciamento/agenda/')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar as tarefas para a data de planejamento inicial.')
            res.redirect('/gerenciamento/agenda/')
        })
    } else {
        console.log('req.body.selecionado=>' + req.body.selecionado)
        console.log('datafim=>' + datafim)
        //console.log('dataini=>' + dataini)
        var nova_dataini = dataini

        Tarefas.find({ concluido: false, 'buscadataini': { $lte: datafim, $gte: dataini }, user: _id }).lean().then((lista_tarefas) => {
            console.log(lista_tarefas)
            if (lista_tarefas == null) {
                Cliente.find({ user: _id }).lean().then((cliente) => {
                    res.render('projeto/gerenciamento/agenda', {checkTesk: 'checked', mes, ano: req.body.mesano, cliente, mestitulo})
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                    res.redirect('/gerenciamento/agenda/')
                })
            } else {
                lista_tarefas.forEach(element => {
                    //console.log('entrou')
                    const { dataini } = element

                    //console.log('dataini=>' + dataini)
                    Usina.findOne({ _id: element.usina }).then((usina) => {
                        //console.log('nome=>' + nome)
                        //console.log('projeto=>' + projeto)
                        if (typeof usina != 'undefined' && usina != '') {
                            mes_busca = nova_dataini.substring(4, 6)
                            //console.log('mes_busca=>' + mes_busca)
                            mes = dataini.substring(5, 7)
                            //console.log('mes=>' + mes)
                            if (mes_busca == mes) {
                                dia = dataini.substring(8, 11)
                                //console.log('dia=>' + dia)
                                //console.log('entrou Planejamento')
                                if (dia == '01') {
                                    tarefas01.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '02') {
                                    tarefas02.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '03') {
                                    tarefas03.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '04') {
                                    tarefas04.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '05') {
                                    tarefas05.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '06') {
                                    tarefas06.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '07') {
                                    tarefas07.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '08') {
                                    tarefas08.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '09') {
                                    tarefas09.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '10') {
                                    tarefas10.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '11') {
                                    tarefas11.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '12') {
                                    tarefas12.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '13') {
                                    tarefas13.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '14') {
                                    tarefas14.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '15') {
                                    tarefas15.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '16') {
                                    tarefas16.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '17') {
                                    tarefas17.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '18') {
                                    tarefas18.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '19') {
                                    tarefas19.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '20') {
                                    tarefas20.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '21') {
                                    tarefas21.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '22') {
                                    tarefas22.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '23') {
                                    tarefas23.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '24') {
                                    tarefas24.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '25') {
                                    tarefas25.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '26') {
                                    tarefas26.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '27') {
                                    tarefas27.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '28') {
                                    tarefas28.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '29') {
                                    tarefas29.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '30') {
                                    tarefas30.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                                if (dia == '31') {
                                    tarefas31.push({ projeto: usina.nome, ehManutencao: true, id: element._id, tarefa: element.servico })
                                }
                            }
                        }
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a usina.')
                        res.redirect('/gerenciamento/agenda/')
                    })

                })
                Cliente.find({ user: _id }).lean().then((cliente) => {
                    res.render('projeto/gerenciamento/agenda', {
                        tarefas01, tarefas02, tarefas03, tarefas04, tarefas05, tarefas06, tarefas07,
                        tarefas08, tarefas09, tarefas10, tarefas11, tarefas12, tarefas13, tarefas14,
                        tarefas15, tarefas16, tarefas17, tarefas18, tarefas19, tarefas20, tarefas21,
                        tarefas22, tarefas23, tarefas24, tarefas25, tarefas26, tarefas27, tarefas28,
                        tarefas29, tarefas30, tarefas31, checkTesk: 'checked', checkInst: 'unchecked',
                        mes, ano: req.body.mesano, cliente, mestitulo
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                    res.redirect('/gerenciamento/agenda/')
                })
            }
        })
    }
})

router.post('/selecionacliente', ehAdmin, (req, res) => {
    const { _id } = req.user
    Cliente.find({ user: _id }).lean().then((cliente) => {
        var ehSelecao = true
        res.render('projeto/gerenciamento/tarefas', { cliente, ehSelecao })
    }).catch(() => {
        res.flash('error_msg', 'Não há cliente cadastrado.')
        req.redirect('/agenda')
    })
})

router.post('/addmanutencao', ehAdmin, (req, res) => {
    const { _id } = req.user
    var data = ''
    var dia = ''
    var ins_fora = []
    var q = 0
    var ehSelecao = false
    var mes = ''

    if (parseFloat(req.body.dia) < 10) {
        dia = '0' + req.body.dia
    } else {
        dia = req.body.dia
    }

    var hoje = new Date()
    var mes = parseFloat(hoje.getMonth()) + 1
    if (mes < 10) {
        mes = '0' + mes
    }

    //console.log('dia=>' + dia)
    data = (String(req.body.ano) + '-' + String(mes) + '-' + String(dia)).toString()
    //console.log('data=>' + data)

    //console.log('req.body.cliente=>' + req.body.cliente)
    Usina.find({ cliente: req.body.cliente }).lean().then((usina) => {
        Pessoa.find({ funins: 'checked', user: _id }).sort({ nome: 'asc' }).then((instalacao) => {
            instalacao.forEach((eleint) => {
                q = q + 1
                var nome = eleint.nome
                var id = eleint._id
                ins_fora.push({ id: id, ins: nome })
                if (q == instalacao.length) {
                    res.render('projeto/gerenciamento/tarefas', { data, usina, fora: ins_fora, ehSelecao })
                }
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar o cronograma.')
            res.redirect('/gerenciamento/cronograma/' + req.params.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao encontrar a usina.')
        res.redirect('/gerenciamento/cronograma/' + req.params.id)
    })
})

router.post('/addtarefa', ehAdmin, (req, res) => {
    const { _id } = req.user
    var dataini = req.body.dataini
    var datafim = req.body.datafim
    var cadastro = dataHoje()
    const equipe = {
        user: _id,
        ins0: req.body.ins0,
        ins1: req.body.ins1,
        ins2: req.body.ins2,
        ins3: req.body.ins3,
        ins4: req.body.ins4,
        ins5: req.body.ins5,
    }
    new Equipe(equipe).save().then(() => {
        Equipe.findOne({ user: _id }).sort({ field: 'asc', _id: -1 }).then((novaequipe) => {
            const tarefa = {
                user: _id,
                equipe: novaequipe._id,
                usina: req.body.usina,
                servico: req.body.manutencao,
                dataini: dataini,
                buscadataini: dataBusca(dataini),
                datafim: datafim,
                buscacdatafim: dataBusca(datafim),
                cadastro: cadastro,
                preco: req.body.preco,
                concluido: false
            }
            //console.log('tarefa=>'+tarefa)
            new Tarefas(tarefa).save().then(() => {
                Tarefas.findOne({ user: _id }).sort({ field: 'asc', _id: -1 }).then((tarefa) => {
                    novaequipe.tarefa = tarefa._id
                    novaequipe.save().then(() => {
                        req.flash('success_msg', 'Manutenção gerada com sucesso.')
                        res.redirect('/gerenciamento/agenda')
                    }).catch((err) => {
                        req.flash('error_msg', 'Falha ao salvar a equipe.')
                        res.redirect('/gerenciamento/agenda')
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Falha ao encontrar a tarefa.')
                    res.redirect('/gerenciamento/agenda')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao salvar a manutenção.')
                res.redirect('/gerenciamento/agenda')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar a equipe.')
            res.redirect('/gerenciamento/agenda')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Falha ao salvar a equipe.')
        res.redirect('/gerenciamento/agenda')
    })
})

router.post('/aplicarcenario/', ehAdmin, (req, res) => {
    var modtam1 = 0
    var modtam2 = 0
    var modtam3 = 0
    var qtdmax1 = 0
    var qtdmax2 = 0
    var qtdmax3 = 0
    var kwpmax1 = 0
    var kwpmax2 = 0
    var kwpmax3 = 0
    var aviso1 = false
    var aviso2 = false
    var aviso3 = false
    var area = req.body.area

    modtam1 = parseFloat(req.body.modtmc1) * parseFloat(req.body.modtml1)
    modtam2 = parseFloat(req.body.modtmc2) * parseFloat(req.body.modtml2)
    modtam3 = parseFloat(req.body.modtmc3) * parseFloat(req.body.modtml3)
    qtdmax1 = Math.round(parseFloat(area) / parseFloat(modtam1))
    qtdmax2 = Math.round(parseFloat(area) / parseFloat(modtam2))
    qtdmax3 = Math.round(parseFloat(area) / parseFloat(modtam3))
    kwpmax1 = (parseFloat(qtdmax1) * parseFloat(req.body.modkwp1)) / parseFloat(1000)
    kwpmax2 = (parseFloat(qtdmax2) * parseFloat(req.body.modkwp2)) / parseFloat(1000)
    kwpmax3 = (parseFloat(qtdmax3) * parseFloat(req.body.modkwp3)) / parseFloat(1000)
    var texto1
    var texto2
    var texto3
    if (parseFloat(kwpmax1) < parseFloat(req.body.kwpsis)) {
        texto1 = 'A potência nominal do sistema é maior que a potência do cenário 1.'
    } else {
        texto1 = 'Cenário 1 compatível com o espaço disponível para a instalação da UFV.'
    }
    if (parseFloat(kwpmax2) < parseFloat(req.body.kwpsis)) {
        texto2 = 'A potência nominal do sistema é maior que a potência do cenário 2.'
    } else {
        texto2 = 'Cenário 2 compatível com o espaço disponível para a instalação da UFV.'
    }
    if (parseFloat(kwpmax3) < parseFloat(req.body.kwpsis)) {
        texto3 = 'A potência nominal do sistema é maior que a potência do cenário 3.'
    } else {
        texto3 = 'Cenário 3 compatível com o espaço disponível para a instalação da UFV.'
    }

    res.render('projeto/gerenciamento/cenarios', {
        modkwp1: req.body.modkwp1, modqtd1: req.body.modqtd1, modtmc1: req.body.modtmc1, modtml1: req.body.modtml1,
        modkwp2: req.body.modkwp2, modqtd2: req.body.modqtd2, modtmc2: req.body.modtmc2, modtml2: req.body.modtml2,
        modkwp3: req.body.modkwp3, modqtd3: req.body.modqtd3, modtmc3: req.body.modtmc3, modtml3: req.body.modtml3,
        kwpmax1, kwpmax2, kwpmax3, qtdmax1, qtdmax2, qtdmax3, kwpmax1, kwpmax2, kwpmax3, kwpsis: req.body.kwpsis,
        area, texto1, texto2, texto3
    })
})

router.post('/gerenciamento/', ehAdmin, (req, res) => {
    const { _id } = req.user
    var erros = ''
    var sucesso = ''
    var medkmh

    //Valida total dos custos já salvos para aplicar as informações de gerenciamento
    Projeto.findOne({ _id: req.body.id }).then((projeto_valida) => {
        if (parseFloat(projeto_valida.trbint) == 0 || projeto_valida.trbint == null) {
            erros = erros + 'Realizar ao menos um custo de instalação.'
        }
        if (parseFloat(projeto_valida.trbpro) == 0 || projeto_valida.trbpro == null) {
            erros = erros + 'Realizar ao menos um custo de projetista.'
        }
        if (parseFloat(projeto_valida.trbges) == 0 || projeto_valida.trbges == null) {
            erros = erros + 'Realizar ao menos um custos de gestão.'
        }
    })

    if (erros != '') {

        req.flash('error_msg', erros)
        res.redirect('/gerenciamento/gereciamento/' + req.body.id)

    } else {

        Projeto.findOne({ _id: req.body.id }).then((projeto) => {
            Cronograma.findOne({ projeto: req.body.id }).then((cronograma) => {
                Detalhado.findOne({ projeto: req.body.id }).then((detalhe) => {
                    Empresa.findOne({ _id: projeto.empresa }).then((empresa) => {
                        Configuracao.findOne({ _id: projeto.configuracao }).then((config) => {
                            if (parseFloat(config.medkmh) > 0) {
                                medkmh = config.medkmh
                            } else {
                                medkmh = 10
                            }
                            /*
                            var qtdins = projeto.qtdins
                            if (qtdins == '' || typeof qtdins == 'undefined'){
                                qtdins = 0
                            }
                            var qtdate = projeto.qtdate
                            if (qtdate == '' || typeof qtdate == 'undefined'){
                                qtdate = 0
                            }
                            var qtdinv = projeto.qtdinv
                            if (qtdinv == '' || typeof qtdinv == 'undefined'){
                                qtdinv = 0
                            }
                            var qtdeae = projeto.qtdate
                            if (qtdeae == '' || typeof qtdeae == 'undefined'){
                                qtdeae = 0
                            }
                            var qtdpnl = projeto.qtdpnl
                            if (qtdpnl == '' || typeof qtdpnl == 'undefined'){
                                qtdpnl = 0
                            }
                            */

                            //Definindo o número de dias de obras
                            var conhrs = config.hrstrb
                            var equipe = projeto.qtdins
                            var plafim
                            var prjfim
                            var atefim
                            var invfim
                            var stbfim
                            var estfim
                            var modfim
                            var invfim
                            var eaefim
                            var pnlfim
                            var valplafim
                            var valprjfim
                            var valateini
                            var valinvini
                            var valstbini
                            var valpnlini
                            var valeaeini
                            var valestini
                            var valmodini
                            var aux
                            var soma


                            if (projeto.tipoCustoGes == 'hora') {
                                plafim = Math.trunc((parseFloat(projeto.trbges) + parseFloat(projeto.desGes)) / conhrs)
                            } else {
                                //console.log('projeto.diasGes=>'+projeto.diasGes)
                                if ((parseFloat(projeto.diasGes) + parseFloat(projeto.desGes)) > 1) {
                                    //console.log('projeto.desGes=>'+projeto.desGes)
                                    plafim = (parseFloat(projeto.diasGes) + parseFloat(projeto.desGes) + parseFloat(projeto.desGes)) - 1
                                } else {
                                    plafim = 0
                                }
                            }
                            //console.log('plafim=>'+plafim)
                            if (projeto.tipoCustoPro == 'hora') {
                                if ((parseFloat(projeto.trbges) + parseFloat(projeto.desPro) + parseFloat(projeto.trbpro)) > 8) {
                                    prjfim = Math.round(((projeto.trbpro + parseFloat(projeto.desPro)) / conhrs), -1)
                                } else {
                                    prjfim = Math.trunc(projeto.trbpro / conhrs)
                                }
                            } else {
                                soma = (parseFloat(projeto.diasGes) + parseFloat(projeto.desPro) + parseFloat(projeto.diasPro)).toFixed(2)
                                if (soma > parseFloat(1)) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        prjfim = aux - 1
                                        if ((parseFloat(prjfim) < parseFloat(projeto.diasGes)) || (parseFloat(prjfim) < parseFloat(projeto.diasPro))) {
                                            prjfim = aux
                                        }
                                    } else {
                                        prjfim = aux
                                    }
                                } else {
                                    prjfim = 0
                                }
                            }
                            //console.log("projeto.tipoCustoIns=>" + projeto.tipoCustoIns)
                            if (projeto.tipoCustoIns == 'hora') {
                                if ((parseFloat(projeto.trbpro) + parseFloat(projeto.desIns) + parseFloat(projeto.trbate)) > 8) {
                                    atefim = Math.round(((projeto.trbate + parseFloat(projeto.desIns)) / conhrs), -1)
                                } else {
                                    atefim = Math.trunc((projeto.trbate + parseFloat(projeto.desIns)) / conhrs)
                                }
                                if ((parseFloat(projeto.trbpro) + parseFloat(projeto.trbinv)) > 8) {
                                    invfim = Math.round((projeto.trbinv / conhrs), -1)
                                } else {
                                    invfim = Math.trunc(projeto.trbinv / conhrs)
                                }
                                if ((parseFloat(projeto.trbpro) + parseFloat(projeto.trbstb)) > 8) {
                                    stbfim = Math.round((projeto.trbstb / conhrs), -1)
                                } else {
                                    stbfim = Math.trunc(projeto.trbstb / conhrs)
                                }
                                if ((parseFloat(projeto.trbpro) + parseFloat(projeto.trbest)) > 8) {
                                    estfim = Math.round((projeto.trbest / conhrs), -1) + 1
                                } else {
                                    estfim = Math.trunc(projeto.trbest / conhrs) + 1
                                }
                                if ((parseFloat(projeto.trbest) + parseFloat(projeto.trbmod)) > 8) {
                                    modfim = Math.round((projeto.trbmod / conhrs), -1)
                                } else {
                                    modfim = Math.trunc(projeto.trbmod / conhrs)
                                }
                                if (projeto.temArmazenamento == 'checked') {
                                    if ((parseFloat(projeto.trbpro) + parseFloat(projeto.trbeae)) > 8) {
                                        eaefim = Math.round((projeto.trbeae / conhrs), -1)
                                    } else {
                                        eaefim = Math.trunc(projeto.trbeae / conhrs)
                                    }
                                }
                                if (projeto.temPainel == 'checked') {
                                    if ((parseFloat(projeto.trbpro) + parseFloat(projeto.trbpnl)) > 8) {
                                        pnlfim = Math.round((projeto.trbpnl / conhrs), -1)
                                    } else {
                                        pnlfim = Math.trunc(projeto.trbpnl / conhrs)
                                    }
                                }
                            } else {
                                soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.desIns) + parseFloat(projeto.diasAte)).toFixed(2)
                                if (soma > 1) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        atefim = parseFloat(projeto.diasAte) + parseFloat(projeto.desIns) - 1
                                        if ((parseFloat(atefim) < parseFloat(projeto.diasPro)) || (parseFloat(atefim) < parseFloat(projeto.diasAte))) {
                                            atefim = projeto.diasAte
                                        }
                                    } else {
                                        atefim = aux
                                    }
                                } else {
                                    atefim = 0
                                }
                                soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.diasInv)).toFixed(2)
                                if (soma > 1) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        invfim = projeto.diasInv - 1
                                        if ((parseFloat(invfim) < parseFloat(projeto.diasPro)) || (parseFloat(invfim) < parseFloat(projeto.diasInv))) {
                                            invfim = projeto.diasInv
                                        }
                                    } else {
                                        invfim = aux
                                    }
                                } else {
                                    invfim = 0
                                }
                                soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.diasStb)).toFixed(2)
                                if (soma > 1) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        stbfim = projeto.diasStb - 1
                                        if ((parseFloat(stbfim) < parseFloat(projeto.diasPro)) || (parseFloat(stbfim) < parseFloat(projeto.diasStb))) {
                                            stbfim = projeto.diasStb
                                        }
                                    } else {
                                        stbfim = aux
                                    }
                                } else {
                                    stbfim = 0
                                }
                                if (projeto.temArmazenamento == 'checked') {
                                    soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.diasEae)).toFixed(2)
                                    if (soma > 1) {
                                        aux = Math.trunc(soma)
                                        if (soma >= aux) {
                                            eaefim = projeto.diasEae - 1
                                            if ((parseFloat(eaefim) < parseFloat(projeto.diasPro)) || (parseFloat(eaefim) < parseFloat(projeto.diasEae))) {
                                                eaefim = projeto.diasEae
                                            }
                                        } else {
                                            eaefim = aux
                                        }
                                    } else {
                                        eaefim = 0
                                    }
                                }
                                if (projeto.temPainel == 'checked') {
                                    soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.diasPnl)).toFixed(2)
                                    if (soma > 1) {
                                        aux = Math.trunc(soma)
                                        if (soma >= aux) {
                                            pnlfim = projeto.diasPnl - 1
                                            if ((parseFloat(pnlfim) < parseFloat(projeto.diasPro)) || (parseFloat(pnlfim) < parseFloat(projeto.diasPnl))) {
                                                pnlfim = projeto.diasPnl
                                            }
                                        } else {
                                            pnlfim = aux
                                        }
                                    } else {
                                        pnlfim = 0
                                    }
                                }
                                soma = (parseFloat(projeto.diasPro) + parseFloat(projeto.diasEst)).toFixed(2)
                                if (soma > 1) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        estfim = projeto.diasEst - 1
                                        if ((parseFloat(estfim) < parseFloat(projeto.diasPro)) || (parseFloat(estfim) < parseFloat(projeto.diasEst))) {
                                            estfim = projeto.diasEst
                                        }
                                    } else {
                                        estfim = aux
                                    }
                                } else {
                                    estfim = 0
                                }
                                soma = (parseFloat(projeto.diasEst) + parseFloat(projeto.diasMod)).toFixed(2)
                                if (soma > 1) {
                                    aux = Math.trunc(soma)
                                    if (soma >= aux) {
                                        modfim = projeto.diasMod - 1
                                        if ((parseFloat(modfim) < parseFloat(projeto.diasEst)) || (parseFloat(modfim) < parseFloat(projeto.diasMod))) {
                                            modfim = projeto.diasMod
                                        }
                                    } else {
                                        modfim = aux
                                    }
                                } else {
                                    modfim = 0
                                }
                            }

                            //console.log('atefim=>' + atefim)
                            //console.log('stbfim=>' + stbfim)
                            //console.log('invfim=>' + invfim)
                            //console.log('pnlfim=>' + pnlfim)
                            //console.log('eaefim=>' + eaefim)
                            //console.log('estfim=>' + estfim)
                            //console.log('modfim=>' + modfim)
                            //console.log('plafim=>' + plafim)
                            //console.log('prjfim=>' + prjfim)
                            valplafim = setData(projeto.valDataIni, plafim)
                            valprjfim = setData(valplafim, prjfim)

                            if (cronograma.dateplafim == '' || typeof cronograma.dateplafim == 'undefined' || isNaN(cronograma.dateplaini)) {
                                cronograma.dateplafim = setData(projeto.valDataIni, plafim)
                            }

                            if (cronograma.dateprjini == '' || typeof cronograma.dateprjini == 'undefined' || isNaN(cronograma.dateprjini)) {
                                cronograma.dateprjini = valplafim
                                if (cronograma.dateprjfim == '' || typeof cronograma.dateprjfim == 'undefined' || isNaN(cronograma.dateprjfim)) {
                                    cronograma.dateprjfim = setData(valplafim, prjfim)
                                }
                            }

                            if (cronograma.dateateini == '' || typeof cronograma.dateateini == 'undefined' || isNaN(cronograma.dateateini)) {
                                valateini = setData(valprjfim, 1)
                                cronograma.dateateini = valateini
                                if (cronograma.dateatefim == '' || typeof cronograma.dateatefim == 'undefined' || isNaN(cronograma.dateatefim)) {
                                    cronograma.dateatefim = setData(valateini, atefim)
                                }
                            }
                            if (cronograma.dateinvini == '' || typeof cronograma.dateinvini == 'undefined' || isNaN(cronograma.dateinvini)) {
                                valinvini = setData(valprjfim, 1)
                                cronograma.dateinvini = valinvini
                                if (cronograma.dateinvfim == '' || typeof cronograma.dateinvfim == 'undefined' || isNaN(cronograma.dateinvfim)) {
                                    cronograma.dateinvfim = setData(valinvini, invfim)
                                }
                            }

                            if (cronograma.datestbini == '' || typeof cronograma.datestbini == 'undefined' || isNaN(cronograma.datestbini)) {
                                valstbini = setData(valprjfim, 1)
                                cronograma.datestbini = valstbini
                                if (cronograma.datestbfim == '' || typeof cronograma.datestbfim == 'undefined' || isNaN(cronograma.datestbfim)) {
                                    cronograma.datestbfim = setData(valstbini, stbfim)
                                }
                            }

                            if ((cronograma.datepnlini == '' || typeof cronograma.datepnlini == 'undefined' || isNaN(cronograma.datepnlini)) && projeto.temPainel == 'checked') {
                                //console.log('tem painel')
                                valpnlini = setData(valprjfim, 1)
                                cronograma.datepnlini = valpnlini
                                if (cronograma.datepnlfim == '' || typeof cronograma.datepnlfim == 'undefined' || isNaN(cronograma.datepnlfim)) {
                                    cronograma.datepnlfim = setData(valpnlini, pnlfim)
                                }
                            }

                            if ((cronograma.dateeaeini == '' || typeof cronograma.dateeaeini == 'undefined' || isNaN(cronograma.dateeaeini)) && projeto.temArmazenamento == 'checked') {
                                //console.log('tem armazenamento')
                                valeaeini = setData(valprjfim, 1)
                                cronograma.dateeaeini = valeaeini
                                if (cronograma.dateeaefim == '' || typeof cronograma.dateeaefim == 'undefined' || isNaN(cronograma.dateeaefim)) {
                                    cronograma.dateeaefim = setData(valeaeini, eaefim)
                                }
                            }

                            if (cronograma.dateestini == '' || typeof cronograma.dateestini == 'undefined' || isNaN(cronograma.dateestini)) {
                                valestini = setData(valprjfim, 1)
                                cronograma.dateestini = valestini
                                if (cronograma.dateestfim == '' || typeof cronograma.dateestfim == 'undefined' || isNaN(cronograma.dateestfim)) {
                                    valestfim = setData(valestini, estfim)
                                    cronograma.dateestfim = valestfim

                                }
                            }
                            //console.log("modfim=>" + modfim)
                            if (cronograma.datemodini == '' || typeof cronograma.datemodini == 'undefined' || isNaN(cronograma.datemodini)) {
                                cronograma.datemodini = valestfim
                                valmodini = valestfim
                                if (cronograma.datemodfim == '' || typeof cronograma.datemodfim == 'undefined' || isNaN(cronograma.datemodfim)) {
                                    //console.log('valmodini=>' + valmodini)
                                    //console.log('valmodini=>' + valmodini)
                                    cronograma.datemodfim = setData(valmodini, modfim)
                                    //console.log('modfim=>' + modfim)
                                    //console.log('setData(valmodini, modfim)=>' + setData(valmodini, modfim))
                                }
                            }
                            var diasObra
                            var diastr
                            if (projeto.tipoCustoIns == 'hora') {
                                diasObra = Math.round(parseFloat((projeto.trbmod) + parseFloat(projeto.trbest)) / parseFloat(config.hrstrb))
                                diastr = Math.round(parseFloat(projeto.tothrs) / parseFloat(config.hrstrb))
                            } else {
                                diasObra = projeto.diasIns
                                //console.log('projeto.diasIns=>' + projeto.diasGes)
                                //console.log('projeto.diasPro=>' + projeto.diasPro)
                                //console.log('projeto.diasPro=>' + projeto.diasPro)
                                //console.log('projeto.desPro=>' + projeto.desPro)
                                //console.log('projeto.desIns=>' + projeto.desIns)
                                diastr = parseFloat(projeto.diasGes) + parseFloat(projeto.diasPro) + parseFloat(projeto.diasIns) + parseFloat(projeto.desPro) + parseFloat(projeto.desIns)
                            }
                            projeto.diasObra = diasObra
                            //console.log('diasObra=>' + diasObra)
                            projeto.diastr = diastr
                            //console.log('diastr=>' + diastr)

                            //console.log('equipe=>' + equipe)
                            var vlrali
                            var discmb
                            var ltocmb
                            var vlrdia
                            if (req.body.vlrali == '') {
                                vlrali = 0
                            } else {
                                vlrali = req.body.vlrali
                            }
                            if (req.body.discmb == '') {
                                discmb = 0
                            } else {
                                discmb = req.body.discmb
                            }
                            if (req.body.ltocmb == '') {
                                ltocmb = 0
                            } else {
                                ltocmb = req.body.ltocmb
                            }
                            if (req.body.vlrdia == '') {
                                vlrdia = 0
                            } else {
                                vlrdia = req.body.vlrdia
                            }
                            projeto.vlrali = vlrali
                            projeto.discmb = discmb
                            projeto.ltocmb = ltocmb
                            projeto.vlrdia = vlrdia
                            //console.log('vlrali=>' + vlrali)
                            //console.log('discmb=>' + discmb)
                            //console.log('ltocmb=>' + ltocmb)
                            //console.log('vlrdia=>' + vlrdia)

                            var tothtl
                            var totcmb
                            var totali
                            //Definindo custo hotel
                            if (parseFloat(vlrdia) > 0) {
                                tothtl = parseFloat(vlrdia) * parseFloat(diasObra) * parseFloat(equipe)
                            } else {
                                tothtl = 0
                            }

                            //Definindo custo deslocamento
                            if (parseFloat(discmb) > 0 && parseFloat(ltocmb)) {
                                autmed = parseFloat(req.body.discmb) / parseFloat(medkmh)
                                totcmb = parseFloat(autmed) * parseFloat(req.body.ltocmb)
                            } else {
                                totcmb = 0
                            }

                            //Definindo custo deslocamento
                            if (parseFloat(vlrali) > 0) {
                                totali = parseFloat(req.body.vlrali) * parseFloat(equipe)
                            } else {
                                totali = 0
                            }
                            projeto.tothtl = tothtl.toFixed(2)
                            projeto.totcmb = totcmb.toFixed(2)
                            projeto.totali = totali.toFixed(2)

                            var totdes = parseFloat(totali) + parseFloat(totcmb) + parseFloat(tothtl)
                            projeto.totdes = totdes.toFixed(2)
                            //--------------------------------------------                               

                            //console.log('totcmb=>' + totcmb)
                            //console.log('tothtl=>' + tothtl)
                            //console.log('totali=>' + totali)
                            //console.log('totdes=>' + totdes)


                            //Custo de Reserva
                            var resger
                            var conadd
                            var impele
                            var seguro
                            var outcer
                            var outpos
                            if (req.body.resger == '') {
                                resger = 0
                            } else {
                                resger = req.body.resger
                            }
                            if (req.body.conadd == '') {
                                conadd = 0
                            } else {
                                conadd = req.body.conadd
                            }
                            if (req.body.impele == '') {
                                impele = 0
                            } else {
                                impele = req.body.impele
                            }
                            if (req.body.seguro == '') {
                                seguro = 0
                            } else {
                                seguro = req.body.seguro
                            }
                            if (req.body.outcer == '') {
                                outcer = 0
                            } else {
                                outcer = req.body.outcer
                            }
                            if (req.body.outpos == '') {
                                outpos = 0
                            } else {
                                outpos = req.body.outpos
                            }
                            projeto.resger = resger
                            projeto.conadd = conadd
                            projeto.impele = impele
                            projeto.seguro = seguro
                            projeto.outcer = outcer
                            projeto.outpos = outpos

                            //console.log('resger=>' + resger)
                            //console.log('conadd=>' + conadd)
                            //console.log('impele=>' + impele)
                            //console.log('seguro=>' + seguro)
                            //console.log('outcer=>' + outcer)
                            //console.log('outpos=>' + outpos)

                            var rescon = parseFloat(impele) + parseFloat(seguro) + parseFloat(outcer) + parseFloat(outpos)
                            rescon = parseFloat(rescon) + parseFloat(conadd)
                            projeto.rescon = rescon.toFixed(2)
                            var reserva = parseFloat(resger) + parseFloat(rescon)
                            projeto.reserva = reserva.toFixed(2)

                            //console.log('rescon=>' + rescon)
                            //console.log('reserva=>' + reserva)
                            //console.log('projeto.totint=>' + projeto.totint)
                            //console.log('projeto.totpro=>' + projeto.totpro)
                            //console.log('projeto.totges=>' + projeto.totges)
                            // //console.log('projeto.valorCer=>' + projeto.valorCer)
                            // //console.log('projeto.valorPos=>' + projeto.valorPos)
                            // //console.log('projeto.valorOcp=>' + projeto.valorOcp)

                            var valorCer
                            var valorPos
                            var valorCen
                            if (typeof projeto.valorCer == "undefined") {
                                valorCer = 0
                            }
                            if (typeof projeto.valorPos == "undefined") {
                                valorPos = 0
                            }
                            if (typeof projeto.valorCen == "undefined") {
                                valorCen = 0
                            }
                            //console.log('valorCer=>' + valorCer)
                            //console.log('valorPos=>' + valorPos)
                            //console.log('valorCen=>' + valorCen)

                            var custoFix = parseFloat(projeto.totint) + parseFloat(projeto.totpro) + parseFloat(projeto.vlrart) + parseFloat(projeto.totges)
                            //console.log('custoFix=>' + custoFix)
                            var custoVar = parseFloat(totdes)
                            //console.log('custoVar=>' + custoVar)
                            var custoEst = parseFloat(valorCer) + parseFloat(valorPos) + parseFloat(valorCen)
                            //console.log('custoEst=>' + custoEst)
                            var totcop = parseFloat(custoFix) + parseFloat(custoVar) + parseFloat(custoEst)

                            projeto.custofix = custoFix.toFixed(2)
                            projeto.custovar = custoVar.toFixed(2)
                            projeto.custoest = custoEst.toFixed(2)
                            projeto.totcop = totcop.toFixed(2)
                            //console.log('totcop=>' + totcop)
                            var custoPlano = parseFloat(totcop) + parseFloat(reserva)
                            projeto.custoPlano = custoPlano.toFixed(2)
                            //console.log('custoPlano=>' + custoPlano)
                            var custoTotal = parseFloat(custoPlano) + parseFloat(projeto.vlrkit)
                            projeto.custoTotal = custoTotal.toFixed(2)
                            //console.log('custoTotal=>' + custoTotal)

                            var desAdm = 0
                            if (parseFloat(empresa.desadm) > 0) {
                                if (empresa.tipodesp == 'quantidade') {
                                    desAdm = (parseFloat(empresa.desadm) * (parseFloat(empresa.perdes) / 100)).toFixed(2)
                                } else {
                                    desAdm = ((parseFloat(empresa.desadm) / parseFloat(empresa.estkwp)) * parseFloat(projeto.potencia)).toFixed(2)
                                }
                            }

                            //console.log('desAdm=>' + desAdm)

                            //Definindo o imposto ISS
                            //console.log('regime_prj.alqNFS=>' + regime_prj.alqNFS)
                            var fatequ
                            var vlrNFS = 0
                            var impNFS = 0
                            var vlrMarkup = 0
                            var prjValor = 0
                            if (req.body.markup == '' || req.body.markup == 0) {
                                //console.log('markup igual a zero')
                                //console.log('projeto.vlrnormal=>'+projeto.vlrnormal)
                                if (req.body.checkFatura != null) {
                                    fatequ = true
                                    vlrNFS = parseFloat(projeto.vlrnormal).toFixed(2)
                                    impNFS = 0
                                } else {
                                    fatequ = false
                                    vlrNFS = (parseFloat(projeto.vlrnormal) - parseFloat(projeto.vlrkit)).toFixed(2)
                                    impNFS = (parseFloat(vlrNFS) * (parseFloat(empresa.alqNFS) / 100)).toFixed(2)
                                }
                                vlrMarkup = (((parseFloat(custoTotal) + parseFloat(desAdm) - parseFloat(reserva) - parseFloat(projeto.vlrkit)) / (1 - (parseFloat(empresa.markup)) / 100)) + parseFloat(projeto.vlrkit)).toFixed(2)
                                projeto.valor = parseFloat(vlrMarkup).toFixed(2)
                                projeto.markup = empresa.markup
                                prjValor = vlrMarkup
                            } else {
                                //console.log('markup diferente de zero')
                                //console.log('custoTotal=>' + custoTotal)
                                //console.log('req.body.markup=>' + req.body.markup)
                                vlrMarkup = (((parseFloat(custoTotal) + parseFloat(desAdm) - parseFloat(reserva) - parseFloat(projeto.vlrkit)) / (1 - (parseFloat(req.body.markup)) / 100)) + parseFloat(projeto.vlrkit)).toFixed(2)
                                //console.log('vlrMarkup=>' + vlrMarkup)
                                if (req.body.checkFatura != null) {
                                    fatequ = true
                                    vlrNFS = parseFloat(vlrMarkup).toFixed(2)
                                    impNFS = 0
                                } else {
                                    fatequ = false
                                    vlrNFS = (parseFloat(vlrMarkup) - parseFloat(projeto.vlrkit)).toFixed(2)
                                    impNFS = (parseFloat(vlrNFS) * (parseFloat(empresa.alqNFS) / 100)).toFixed(2)
                                }
                                projeto.markup = req.body.markup
                                projeto.valor = vlrMarkup
                                prjValor = parseFloat(vlrMarkup).toFixed(2)
                            }
                            //console.log('vlrNFS=>' + vlrNFS)
                            //console.log('impNFS=>' + impNFS)
                            //console.log('prjValor=>' + prjValor)
                            //kWp médio
                            projeto.vrskwp = (parseFloat(prjValor) / parseFloat(projeto.potencia)).toFixed(2)
                            projeto.fatequ = fatequ

                            var vlrcom = 0
                            //Validando a comissão
                            if (projeto.percom != null) {
                                vlrcom = parseFloat(vlrNFS) * (parseFloat(projeto.percom) / 100)
                                projeto.vlrcom = parseFloat(vlrcom).toFixed(2)
                            }
                            //console.log('vlrcom=>' + vlrcom)

                            //Definindo o Lucro Bruto
                            var recLiquida = parseFloat(prjValor) - parseFloat(impNFS)
                            projeto.recLiquida = parseFloat(recLiquida).toFixed(2)

                            //console.log('recLiquida=>' + recLiquida)
                            var lucroBruto = parseFloat(recLiquida) - parseFloat(projeto.vlrkit)
                            projeto.lucroBruto = parseFloat(lucroBruto).toFixed(2)

                            //console.log('lucroBruto=>' + lucroBruto)

                            var lbaimp = 0
                            if (parseFloat(empresa.desadm) > 0) {
                                //console.log('desAdm=>' + desAdm)
                                lbaimp = (parseFloat(lucroBruto) - parseFloat(custoPlano) - parseFloat(desAdm)).toFixed(2)
                                projeto.desAdm = parseFloat(desAdm).toFixed(2)
                            } else {
                                lbaimp = (parseFloat(lbaimp) - parseFloat(custoPlano))
                                projeto.desAdm = 0
                            }

                            //Deduzindo as comissões do Lucro Antes dos Impostos
                            if (vlrcom == 0 || vlrcom == '') {
                                lbaimp = parseFloat(lbaimp)
                            } else {
                                lbaimp = parseFloat(lbaimp) - parseFloat(vlrcom)
                            }
                            projeto.lbaimp = lbaimp.toFixed(2)
                            //console.log('lbaimp=>' + lbaimp)

                            //Dashboard              
                            //Participação dos componentes
                            //Kit
                            var parKitEqu = parseFloat(detalhe.valorEqu) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parKitEqu = parseFloat(parKitEqu).toFixed(2)
                            //Módulos
                            var parModEqu = parseFloat(detalhe.valorMod) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parModEqu = parseFloat(parModEqu).toFixed(2)
                            //Inversor
                            var parInvEqu = parseFloat(detalhe.valorInv) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parInvEqu = parseFloat(parInvEqu).toFixed(2)
                            //Estrutura
                            var parEstEqu = (parseFloat(detalhe.valorEst) + parseFloat(detalhe.valorCim)) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parEstEqu = parseFloat(parEstEqu).toFixed(2)
                            //Cabos
                            var parCabEqu = parseFloat(detalhe.valorCab) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parCabEqu = parseFloat(parCabEqu).toFixed(2)
                            //Armazenagem
                            var parEbtEqu = parseFloat(detalhe.valorEbt) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parEbtEqu = parseFloat(parEbtEqu).toFixed(2)
                            //DPS CC + CA
                            var parDpsEqu = (parseFloat(detalhe.valorDPSCC) + parseFloat(detalhe.valorDPSCA)) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parDpsEqu = parseFloat(parDpsEqu).toFixed(2)
                            //Disjuntores CC + CA
                            var parDisEqu = (parseFloat(detalhe.valorDisCC) + parseFloat(detalhe.valorDisCA)) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parDisEqu = parseFloat(parDisEqu).toFixed(2)
                            //StringBox
                            var parSbxEqu = parseFloat(detalhe.valorSB) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parSbxEqu = parseFloat(parSbxEqu).toFixed(2)
                            //Inserir Proteção CA
                            //Cercamento
                            var parCerEqu = parseFloat(detalhe.valorCer) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parCerEqu = parseFloat(parCerEqu).toFixed(2)
                            //Central
                            var parCenEqu = parseFloat(detalhe.valorCen) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parCenEqu = parseFloat(parCenEqu).toFixed(2)
                            //Postes de Condução
                            var parPosEqu = parseFloat(detalhe.valorPos) / parseFloat(detalhe.vlrTotal) * 100
                            projeto.parPosEqu = parseFloat(parPosEqu).toFixed(2)

                            projeto.vlrNFS = parseFloat(vlrNFS).toFixed(2)
                            projeto.impNFS = parseFloat(impNFS).toFixed(2)

                            projeto.dataIns = dataMensagem(valateini)
                            projeto.valDataIns = valateini

                            cronograma.save().then(() => {
                                //console.log('salvou cronograma')
                                projeto.save().then(() => {
                                    //console.log('salvou projeto')
                                    sucesso = 'Custo de gerenciamento aplicado com sucesso.'
                                    req.flash('success_msg', sucesso)
                                    res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                                }).catch((err) => {
                                    req.flash('error_msg', 'Falha ao aplicar o projeto.')
                                    res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Falha ao aplicar o cronograma.')
                                res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                            })
                        }).catch((err) => {
                            req.flash('error_msg', 'Houve um erro ao encontrar a empresa.')
                            res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                        })
                    }).catch((err) => {
                        req.flash('error_msg', 'Houve um erro ao encontrar as configurações.')
                        res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                    })
                }).catch((err) => {
                    req.flash('error_msg', 'Falha ao encontrar os detalhes.')
                    res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
                })
            }).catch((err) => {
                req.flash('error_msg', 'Falha ao encontrar o cronograma.')
                res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Falha ao encontrar o projeto.')
            res.redirect('/gerenciamento/gerenciamento/' + req.body.id)
        })
    }
})

router.post('/custo/', ehAdmin, (req, res) => {
    const { _id } = req.user
    Projeto.findOne({ _id: req.body.id }).then((projeto) => {

        //Inserir calculo dos impostos
        Empresa.findOne({ _id: projeto.empresa }).then((empresa) => {

            var prjFat = empresa.prjFat
            var prjLR = empresa.prjLR
            var prjLP = empresa.prjLP
            //var vlrDAS = empresa.vlrDAS
            //console.log('prjFat=>' + prjFat)
            //console.log('prjLR=>' + prjLR)
            //console.log('prjLP=>' + prjLP)

            var impostoIRPJ = 0
            var impostoIRPJAdd = 0
            var impostoCSLL = 0
            var impostoPIS = 0
            var impostoCOFINS = 0
            var impostoICMS = 0
            var totalImposto = 0
            var totalTributos = 0

            var fatadd
            var fataju
            var aux

            //console.log('projeto.vlrNFS=>' + projeto.vlrNFS)

            if (empresa.regime == 'Simples') {
                //console.log('Empresa=>Simples')
                var alqEfe = ((parseFloat(prjFat) * (parseFloat(empresa.alqDAS) / 100)) - (parseFloat(empresa.vlrred))) / parseFloat(prjFat)
                //console.log('alqEfe=>' + alqEfe)
                var totalSimples = parseFloat(projeto.vlrNFS) * (parseFloat(alqEfe))
                //console.log('totalSimples=>' + totalSimples)
                totalImposto = parseFloat(totalSimples).toFixed(2)
                //console.log('totalImposto=>' + totalImposto)
                projeto.impostoSimples = parseFloat(totalImposto).toFixed(2)
                impostoIRPJAdd = 0
                projeto.impostoAdd = 0
                impostoIRPJ = 0
                projeto.impostoIRPJ = 0
                impostoCSLL = 0
                projeto.impostoCSLL = 0
                impostoCOFINS = 0
                projeto.impostoCOFINS = 0
                impostoPIS = 0
                projeto.impostoPIS = 0
            } else {
                if (empresa.regime == 'Lucro Real') {
                    if ((parseFloat(prjLR) / 12) > 20000) {
                        fatadd = (parseFloat(prjLR) / 12) - 20000
                        //console.log('fatadd=>' + fatadd)
                        fataju = parseFloat(fatadd) * (parseFloat(empresa.alqIRPJAdd) / 100)
                        //console.log('fataju=>' + fataju)
                        aux = parseFloat(fatadd) / parseFloat(projeto.lbaimp)
                        //console.log('aux=>' + aux)
                        impostoIRPJAdd = parseFloat(fataju) / parseFloat(aux)
                        projeto.impostoAdd = impostoIRPJAdd.toFixed(2)
                    } else {
                        impostoIRPJAdd = 0
                        projeto.impostoAdd = 0
                    }

                    impostoIRPJ = parseFloat(projeto.lbaimp) * (parseFloat(empresa.alqIRPJ) / 100)
                    projeto.impostoIRPJ = impostoIRPJ.toFixed(2)
                    impostoCSLL = parseFloat(projeto.lbaimp) * (parseFloat(empresa.alqCSLL) / 100)
                    projeto.impostoCSLL = impostoCSLL.toFixed(2)
                    impostoPIS = parseFloat(projeto.vlrNFS) * 0.5 * (parseFloat(empresa.alqPIS) / 100)
                    projeto.impostoPIS = impostoPIS.toFixed(2)
                    impostoCOFINS = parseFloat(projeto.vlrNFS) * 0.5 * (parseFloat(empresa.alqCOFINS) / 100)
                    projeto.impostoCOFINS = impostoCOFINS.toFixed(2)
                    totalImposto = parseFloat(impostoIRPJ) + parseFloat(impostoIRPJAdd) + parseFloat(impostoCSLL) + parseFloat(impostoPIS) + parseFloat(impostoCOFINS)
                } else {
                    //console.log('Empresa=>Lucro Presumido')
                    if (((parseFloat(prjLP) * 0.32) / 3) > 20000) {
                        fatadd = ((parseFloat(prjLP) * 0.32) / 3) - 20000
                        fataju = parseFloat(fatadd) / 20000
                        impostoIRPJAdd = (parseFloat(projeto.vlrNFS) * 0.32) * (parseFloat(fataju) / 100) * (parseFloat(empresa.alqIRPJAdd) / 100)
                        projeto.impostoAdd = impostoIRPJAdd.toFixed(2)
                    } else {
                        impostoIRPJAdd = 0
                        projeto.impostoAdd = 0
                    }
                    //console.log('impostoIRPJAdd=>' + impostoIRPJAdd)
                    impostoIRPJ = parseFloat(projeto.vlrNFS) * 0.32 * (parseFloat(empresa.alqIRPJ) / 100)
                    projeto.impostoIRPJ = impostoIRPJ.toFixed(2)
                    //console.log('impostoIRPJ=>' + impostoIRPJ)
                    impostoCSLL = parseFloat(projeto.vlrNFS) * 0.32 * (parseFloat(empresa.alqCSLL) / 100)
                    projeto.impostoCSLL = impostoCSLL.toFixed(2)
                    //console.log('impostoCSLL=>' + impostoCSLL)
                    impostoCOFINS = parseFloat(projeto.vlrNFS) * (parseFloat(empresa.alqCOFINS) / 100)
                    projeto.impostoCOFINS = impostoCOFINS.toFixed(2)
                    //console.log('impostoCOFINS=>' + impostoCOFINS)
                    impostoPIS = parseFloat(projeto.vlrNFS) * (parseFloat(empresa.alqPIS) / 100)
                    projeto.impostoPIS = impostoPIS.toFixed(2)
                    //console.log('impostoPIS=>' + impostoPIS)
                    totalImposto = parseFloat(impostoIRPJ) + parseFloat(impostoIRPJAdd) + parseFloat(impostoCSLL) + parseFloat(impostoPIS) + parseFloat(impostoCOFINS)
                    //console.log('totalImposto=>' + totalImposto)
                }
            }
            //Validar ICMS
            //console.log('projeto.fatequ=>' + projeto.fatequ)
            //console.log('empresa.alqICMS=>' + empresa.alqICMS)
            if (projeto.fatequ == true) {
                if (empresa.alqICMS != null) {
                    impostoICMS = (parseFloat(projeto.vlrNFS)) * (parseFloat(empresa.alqICMS) / 100)
                    totalTributos = parseFloat(totalImposto) + parseFloat(projeto.impNFS) + parseFloat(impostoICMS)
                    totalImposto = parseFloat(totalImposto) + parseFloat(impostoICMS)
                }
            } else {
                impostoICMS = 0
                totalTributos = parseFloat(totalImposto) + parseFloat(projeto.impNFS)
            }
            projeto.impostoICMS = impostoICMS.toFixed(2)
            //console.log('totalImposto=>' + totalImposto)
            projeto.totalImposto = parseFloat(totalImposto).toFixed(2)
            //console.log('totalTributos=>' + totalTributos)
            projeto.totalTributos = parseFloat(totalTributos).toFixed(2)

            //Lucro Líquido descontados os impostos
            var lucroLiquido = 0
            //console.log('projeto.lbaimp=>'+projeto.lbaimp)
            //console.log('totalImposto=>'+totalImposto)
            lucroLiquido = parseFloat(projeto.lbaimp) - parseFloat(totalImposto)
            projeto.lucroLiquido = parseFloat(lucroLiquido).toFixed(2)
            //console.log('lucroLiquido=>'+lucroLiquido)

            //Dashboard
            //Participação sobre o lucro total
            var parLiqVlr = parseFloat(lucroLiquido) / parseFloat(projeto.valor) * 100
            projeto.parLiqVlr = parLiqVlr.toFixed(2)
            var parKitVlr = parseFloat(projeto.vlrkit) / parseFloat(projeto.valor) * 100
            projeto.parKitVlr = parKitVlr.toFixed(2)
            var parIntVlr = parseFloat(projeto.totint) / parseFloat(projeto.valor) * 100
            projeto.parIntVlr = parIntVlr.toFixed(2)
            var parGesVlr = parseFloat(projeto.totges) / parseFloat(projeto.valor) * 100
            projeto.parGesVlr = parGesVlr.toFixed(2)
            var parProVlr = parseFloat(projeto.totpro) / parseFloat(projeto.valor) * 100
            projeto.parProVlr = parProVlr.toFixed(2)
            var parArtVlr = parseFloat(projeto.vlrart) / parseFloat(projeto.valor) * 100
            projeto.parArtVlr = parArtVlr.toFixed(2)
            if (parseFloat(projeto.totcmb) > 0) {
                var parCmbVlr = parseFloat(projeto.totcmb) / parseFloat(projeto.valor) * 100
                projeto.parCmbVlr = parseFloat(parCmbVlr).toFixed(2)
            }
            if (parseFloat(projeto.totali) > 0) {
                var parAliVlr = parseFloat(projeto.totali) / parseFloat(projeto.valor) * 100
                projeto.parAliVlr = parseFloat(parAliVlr).toFixed(2)
            }
            if (parseFloat(projeto.tothtl) > 0) {
                var parEstVlr = parseFloat(projeto.tothtl) / parseFloat(projeto.valor) * 100
                projeto.parEstVlr = parEstVlr.toFixed(2)
            }
            if (parseFloat(projeto.reserva) > 0) {
                var parResVlr = parseFloat(projeto.reserva) / parseFloat(projeto.valor) * 100
                projeto.parResVlr = parseFloat(parResVlr).toFixed(2)
            }
            var parDedVlr = parseFloat(projeto.custoPlano) / parseFloat(projeto.valor) * 100
            projeto.parDedVlr = parDedVlr.toFixed(2)
            var parISSVlr
            if (projeto.impNFS > 0) {
                parISSVlr = parseFloat(projeto.impNFS) / parseFloat(projeto.valor) * 100
            } else {
                parISSVlr = 0
            }

            projeto.parISSVlr = parISSVlr.toFixed(2)
            var parImpVlr = (parseFloat(totalImposto) / parseFloat(projeto.valor)) * 100
            projeto.parImpVlr = parImpVlr.toFixed(2)
            if (projeto.vlrcom > 0) {
                var parComVlr = parseFloat(projeto.vlrcom) / parseFloat(projeto.valor) * 100
                projeto.parComVlr = parComVlr.toFixed(2)
            }

            //Participação sobre o Faturamento      
            var parLiqNfs = parseFloat(lucroLiquido) / parseFloat(projeto.vlrNFS) * 100
            projeto.parLiqNfs = parseFloat(parLiqNfs).toFixed(2)
            if (projeto.fatequ == true) {
                var parKitNfs = parseFloat(projeto.vlrkit) / parseFloat(projeto.vlrNFS) * 100
                projeto.parKitNfs = parseFloat(parKitNfs).toFixed(2)
            }
            var parIntNfs = parseFloat(projeto.totint) / parseFloat(projeto.vlrNFS) * 100
            projeto.parIntNfs = parseFloat(parIntNfs).toFixed(2)
            var parGesNfs = parseFloat(projeto.totges) / parseFloat(projeto.vlrNFS) * 100
            projeto.parGesNfs = parseFloat(parGesNfs).toFixed(2)
            var parProNfs = parseFloat(projeto.totpro) / parseFloat(projeto.vlrNFS) * 100
            projeto.parProNfs = parseFloat(parProNfs).toFixed(2)
            var parArtNfs = parseFloat(projeto.vlrart) / parseFloat(projeto.vlrNFS) * 100
            projeto.parArtNfs = parseFloat(parArtNfs).toFixed(2)
            if (parseFloat(projeto.totcmb) > 0) {
                var parCmbNfs = parseFloat(projeto.totcmb) / parseFloat(projeto.vlrNFS) * 100
                projeto.parCmbNfs = parseFloat(parCmbNfs).toFixed(2)
            }
            if (parseFloat(projeto.totali) > 0) {
                var parAliNfs = parseFloat(projeto.totali) / parseFloat(projeto.vlrNFS) * 100
                projeto.parAliNfs = parseFloat(parAliNfs).toFixed(2)
            }
            if (parseFloat(projeto.tothtl) > 0) {
                var parEstNfs = parseFloat(projeto.tothtl) / parseFloat(projeto.vlrNFS) * 100
                projeto.parEstNfs = parEstNfs.toFixed(2)
            }
            if (parseFloat(projeto.reserva) > 0) {
                var parResNfs = parseFloat(projeto.reserva) / parseFloat(projeto.vlrNFS) * 100
                projeto.parResNfs = parseFloat(parResNfs).toFixed(2)
            }
            var parDedNfs = parseFloat(projeto.custoPlano) / parseFloat(projeto.vlrNFS) * 100
            projeto.parDedNfs = parseFloat(parDedNfs).toFixed(2)
            var parISSNfs = parseFloat(projeto.impNFS) / parseFloat(projeto.vlrNFS) * 100
            projeto.parISSNfs = parseFloat(parISSNfs).toFixed(2)
            var parImpNfs = (parseFloat(totalImposto) / parseFloat(projeto.vlrNFS)) * 100
            projeto.parImpNfs = parseFloat(parImpNfs).toFixed(2)
            if (projeto.vlrcom > 0) {
                var parComNfs = parseFloat(projeto.vlrcom) / parseFloat(projeto.vlrNFS) * 100
                projeto.parComNfs = parseFloat(parComNfs).toFixed(2)
            }

            projeto.save().then(() => {
                var sucesso = []
                sucesso = 'Projeto salvo com sucesso.'
                req.flash('success_msg', sucesso)
                res.redirect('/gerenciamento/custo/' + req.body.id)
            }).catch(() => {
                req.flash('error_msg', 'Houve um erro ao salvar o projeto.')
                res.redirect('/gerenciamento/custo/' + req.body.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o empresa.')
            res.redirect('/gerenciamento/custo/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o projeto.')
        res.redirect('/gerenciamento/custo/' + req.body.id)
    })
})

router.post('/salvacronograma/', ehAdmin, (req, res) => {

    var erros = ''
    var sucesso = ''
    const { _id } = req.user
    var dataentrega
    var ano
    var mes
    var dia
    var dataEntregaReal
    var atrasou = false

    var checkPla = 'unchecked'
    var checkAte = 'unchecked'
    var checkPrj = 'unchecked'
    var checkEst = 'unchecked'
    var checkMod = 'unchecked'
    var checkInv = 'unchecked'
    var checkEae = 'unchecked'
    var checkStb = 'unchecked'
    var checkPnl = 'unchecked'
    var checkVis = 'unchecked'

    if ((typeof req.body.datepla != 'undefined') && (req.body.datepla != '')) {
        checkPla = 'checked'
    }
    if ((typeof req.body.dateate != 'undefined') && (req.body.dateate != '')) {
        checkAte = 'checked'
    }
    if ((typeof req.body.dateprj != 'undefined') && (req.body.dateprj != '')) {
        checkPrj = 'checked'
    }
    if ((typeof req.body.dateest != 'undefined') && (req.body.dateest != '')) {
        checkEst = 'checked'
    }
    if ((typeof req.body.datemod != 'undefined') && (req.body.datemod != '')) {
        checkMod = 'checked'
    }
    if ((typeof req.body.dateinv != 'undefined') && (req.body.dateinv != '')) {
        checkInv = 'checked'
    }
    if ((typeof req.body.dateeae != 'undefined') && (req.body.dateeae != '')) {
        checkEae = 'checked'
    }
    if ((typeof req.body.datestb != 'undefined') && (req.body.datestb != '')) {
        checkStb = 'checked'
    }
    if ((typeof req.body.datepnl != 'undefined') && (req.body.datepnl != '')) {
        checkPnl = 'checked'
    }
    if ((typeof req.body.datevis != 'undefined') && (req.body.datevis != '')) {
        checkVis = 'checked'
    }

    Projeto.findOne({ _id: req.body.idprojeto }).then((prj_entrega) => {
        Cronograma.findOne({ projeto: req.body.idprojeto }).then((cronograma) => {
            Realizado.findOne({ projeto: req.body.idprojeto }).then((realizado) => {
                //console.log('req.body.perges=>' + req.body.perges)
                if (req.body.perges != '' && typeof req.body.perges != 'undefined' && req.body.perges != 0) {
                    var AC = 0
                    var ev = 0
                    var evPerGes = 0
                    var evPerKit = 0
                    var evPerIns = 0
                    var evPerPro = 0
                    var evPerAli = 0
                    var evPerDes = 0
                    var evPerHtl = 0
                    var evPerCmb = 0
                    var evPerCer = 0
                    var evPerCen = 0
                    var evPerPos = 0
                    var cpi = 0
                    var tcpi = 0
                    var spi = 0
                    var eac = 0
                    var etc = 0
                    var texto

                    var custoPlanoPrj = prj_entrega.custoPlano
                    var vlrKitPrj = prj_entrega.vlrkit
                    var desAdm = prj_entrega.desAdm
                    var vlrcom = prj_entrega.vlrcom
                    var totalTributos = prj_entrega.totalTributos
                    var margemLL = prj_entrega.valor * (parseFloat(prj_entrega.parLiqVlr) / 100)
                    var valorComReserva = parseFloat(custoPlanoPrj) + parseFloat(vlrKitPrj) + parseFloat(desAdm) + parseFloat(vlrcom) + parseFloat(totalTributos) + parseFloat(margemLL)

                    //Definição do erning value
                    evPerGes = (parseFloat(prj_entrega.totges)) * (parseFloat(req.body.perges) / 100)
                    if (isNaN(evPerGes)) {
                        evPerGes = 0
                    }
                    evPerKit = (parseFloat(prj_entrega.vlrkit)) * (parseFloat(req.body.perkit) / 100)
                    if (isNaN(evPerKit)) {
                        evPerKit = 0
                    }
                    evPerIns = (parseFloat(prj_entrega.totint)) * (parseFloat(req.body.perins) / 100)
                    if (isNaN(evPerIns)) {
                        evPerIns = 0
                    }
                    evPerPro = (parseFloat(prj_entrega.totpro)) * (parseFloat(req.body.perpro) / 100)
                    if (isNaN(evPerPro)) {
                        evPerPro = 0
                    }
                    evPerAli = (parseFloat(prj_entrega.totali)) * (parseFloat(req.body.perali) / 100)
                    if (isNaN(evPerAli)) {
                        evPerAli = 0
                    }
                    evPerDes = (parseFloat(prj_entrega.totdes)) * (parseFloat(req.body.perdes) / 100)
                    if (isNaN(evPerDes)) {
                        evPerDes = 0
                    }
                    evPerHtl = (parseFloat(prj_entrega.tothtl)) * (parseFloat(req.body.perhtl) / 100)
                    if (isNaN(evPerHtl)) {
                        evPerHtl = 0
                    }
                    evPerCmb = (parseFloat(prj_entrega.totcmb)) * (parseFloat(req.body.percmb) / 100)
                    if (isNaN(evPerCmb)) {
                        evPerCmb = 0
                    }
                    evPerCer = (parseFloat(prj_entrega.totcer)) * (parseFloat(req.body.percer) / 100)
                    if (isNaN(evPerCer)) {
                        evPerCer = 0
                    }
                    evPerCen = (parseFloat(prj_entrega.totcen)) * (parseFloat(req.body.percen) / 100)
                    if (isNaN(evPerCen)) {
                        evPerCen = 0
                    }
                    evPerPos = (parseFloat(prj_entrega.totpos)) * (parseFloat(req.body.perpos) / 100)
                    if (isNaN(evPerPos)) {
                        evPerPos = 0
                    }

                    if (prj_entrega.ehDireto == false) {
                        evPerDes = 0
                    } else {
                        evPerCmb = 0
                        evPerHtl = 0
                    }

                    //console.log('evPerGes=>' + evPerGes)
                    //console.log('evPerKit=>' + evPerKit)
                    //console.log('evPerIns=>' + evPerIns)
                    //console.log('evPerPro=>' + evPerPro)
                    //console.log('evPerDes=>' + evPerDes)
                    //console.log('evPerAli=>' + evPerAli)
                    //console.log('evPerHtl=>' + evPerHtl)
                    //console.log('evPerCmb=>' + evPerCmb)
                    //console.log('evPerCer=>' + evPerCer)
                    //console.log('evPerCen=>' + evPerCen)
                    //console.log('evPerPos=>' + evPerPos)

                    ev = (parseFloat(evPerGes) + parseFloat(evPerKit) + parseFloat(evPerIns) + parseFloat(evPerPro) + parseFloat(evPerAli) + parseFloat(evPerDes) + parseFloat(evPerHtl) + parseFloat(evPerCmb) + parseFloat(evPerCer) + parseFloat(evPerCen) + parseFloat(evPerPos)).toFixed(2)
                    //console.log('ev=>' + ev)

                    //console.log('vlrKitPrj=>' + vlrKitPrj)
                    //console.log('custoPlanoPrj=>' + custoPlanoPrj)
                    var perConclusao = parseFloat(ev) / (parseFloat(vlrKitPrj) + parseFloat(custoPlanoPrj))
                    if (perConclusao == 100) {
                        texto = 'Projeto Concluído'
                    }
                    //console.log('perConclusao=>' + perConclusao)
                    var custoPlanoRlz
                    var totges = req.body.totges
                    if (isNaN(totges) || totges == '' || totges == null) {
                        totges = 0
                    }

                    //console.log('totges=>' + totges)
                    var vlrKitRlz = req.body.vlrkit
                    if (isNaN(vlrKitRlz) || vlrKitRlz == '' || vlrKitRlz == null) {
                        vlrKitRlz = 0
                    }
                    //console.log('vlrKitRlz=>' + vlrKitRlz)
                    var totint = req.body.totint
                    if (isNaN(totint) || totint == '' || totint == null) {
                        totint = 0
                    }
                    var toteng = 0
                    var matate = 0
                    var vlremp = 0
                    var compon = 0
                    //console.log('totint=>' + totint)
                    var totpro = req.body.totpro
                    if (isNaN(totpro) || totpro == '' || totpro == null) {
                        totpro = 0
                    }
                    //console.log('totpro=>' + totpro)
                    var totali = req.body.totali
                    if (isNaN(totali) || totali == '' || totali == null) {
                        totali = 0
                    }
                    //console.log('totali=>' + totali)
                    var tothtl = req.body.tothtl
                    if (isNaN(tothtl) || tothtl == '' || tothtl == null) {
                        tothtl = 0
                    }
                    //console.log('tothtl=>' + tothtl)
                    var totcmb = req.body.totcmb
                    if (isNaN(totcmb) || totcmb == '' || totcmb == null) {
                        totcmb = 0
                    }
                    //console.log('totcmb=>' + totcmb)
                    var totdes = req.body.totdes
                    if (isNaN(totdes) || totdes == '' || totdes == null) {
                        totdes = 0
                    }
                    //console.log('totdes=>' + totdes)
                    var cercamento = req.body.cercamento
                    if (isNaN(cercamento) || cercamento == '' || cercamento == null) {
                        cercamento = 0
                    }
                    //console.log('cercamento=>' + cercamento)
                    var central = req.body.central
                    if (isNaN(central) || central == '' || central == null) {
                        central = 0
                    }
                    //console.log('central=>' + central)
                    var postecond = req.body.postecond
                    if (isNaN(postecond) || postecond == '' || postecond == null) {
                        postecond = 0
                    }
                    //console.log('postecond=>' + postecond)
                    if (prj_entrega.ehDireto == false && prj_entrega.ehVinculo == false) {
                        custoPlanoRlz = parseFloat(totges) + parseFloat(vlrKitRlz) + parseFloat(totint) + parseFloat(toteng) + parseFloat(matate) + parseFloat(vlremp) + parseFloat(compon) + parseFloat(totpro) + parseFloat(totali) + parseFloat(tothtl) + parseFloat(totcmb) + parseFloat(cercamento) + parseFloat(central) + parseFloat(postecond)
                    } else {
                        custoPlanoRlz = parseFloat(totges) + parseFloat(vlrKitRlz) + parseFloat(totint) + parseFloat(toteng) + parseFloat(matate) + parseFloat(vlremp) + parseFloat(compon) + parseFloat(totpro) + parseFloat(totdes) + parseFloat(totali) + parseFloat(cercamento) + parseFloat(central) + parseFloat(postecond)
                    }
                    //Definição do actual cost

                    //console.log('custoPlanoRlz=>' + custoPlanoRlz)
                    /*
                    //console.log('vlrKitRlz=>' + vlrKitRlz)
                    //console.log('desAdm=>' + desAdm)
                    //console.log('vlrcom=>' + vlrcom)
                    //console.log('totalTributos=>' + totalTributos)
                    //console.log('margemLL=>' + margemLL)
                    */

                    //Cálculo dos indicadores de conclusão do projeto
                    AC = parseFloat(custoPlanoRlz).toFixed(2)
                    if (isNaN(AC)) {
                        AC = 0
                    }
                    //console.log('AC=>' + AC)
                    if (AC != '') {
                        ac = AC
                    } else {
                        ac = ev
                    }
                    cpi = parseFloat(ev) / parseFloat(AC)
                    //console.log('cpi=>' + cpi)
                    if (cpi == 'Infinity' || isNaN(cpi)) {
                        cpi = 1
                    }
                    tcpi = (parseFloat(prj_entrega.valor) - parseFloat(ev)) / (parseFloat(prj_entrega.valor) - parseFloat(ac))
                    if (isNaN(tcpi)) {
                        tcpi = 1
                    }
                    eac = parseFloat(prj_entrega.custoTotal) / parseFloat(cpi)
                    if (isNaN(eac)) {
                        eac = 0
                    }
                    if (cronograma.perPro == 100) {
                        etc = parseFloat(eac) - parseFloat(AC) - parseFloat(prj_entrega.vlrart)
                    } else {
                        etc = parseFloat(eac) - parseFloat(AC)
                    }
                    if (isNaN(etc)) {
                        etc = 0
                    }
                    spi = parseFloat(prj_entrega.hrsprj) * (1 - (parseFloat(perConclusao)))
                    if (isNaN(spi)) {
                        spi = 0
                    }
                    //console.log('Math.round(perConclusao * 100)=>' + Math.round(perConclusao * 100))
                    prj_entrega.perConclusao = Math.round(perConclusao * 100)
                    //console.log('AC=>' + AC)
                    prj_entrega.actualCost = parseFloat(AC).toFixed(2)
                    //console.log('cpi=>' + cpi)
                    prj_entrega.cpi = parseFloat(cpi).toFixed(4)
                    //console.log('tcpi=>' + tcpi)
                    prj_entrega.tcpi = parseFloat(tcpi).toFixed(4)
                    //console.log('etc=>' + etc)
                    prj_entrega.etc = parseFloat(etc).toFixed(2)
                    //console.log('eac=>' + eac)
                    prj_entrega.eac = parseFloat(eac).toFixed(2)
                    //console.log('spi=>' + spi)
                    prj_entrega.spi = parseFloat(spi).toFixed(2)
                    prj_entrega.tspi = 1
                } else {
                    prj_entrega.perConclusao = 0
                    prj_entrega.etc = prj_entrega.valor
                    prj_entrega.actualCost = 0
                    prj_entrega.cpi = 1
                    prj_entrega.tcpi = 1
                    prj_entrega.spi = 1
                    prj_entrega.tspi = 1
                }

                //console.log('req.body.executando=>' + req.body.executando)
                if (req.body.executando == 'true') {
                    if (req.body.datepla != '' && typeof req.body.datepla != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateplafim, req.body.datepla)
                    }
                    if (req.body.dateprj != '' && typeof req.body.dateprj != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateprjfim, req.body.dateprj)
                    }

                    if (req.body.dateate != '' && typeof req.body.dateate != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateatefim, req.body.dateate)
                    }

                    if (req.body.dateest != '' && typeof req.body.dateest != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateestfim, req.body.dateest)
                    }

                    if (req.body.datemod != '' && typeof req.body.datemod != 'undefined') {
                        atrasou = comparaDatas(cronograma.datemodfim, req.body.datemod)
                    }

                    if (req.body.dateinv != '' && typeof req.body.dateinv != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateinvfim, req.body.dateinv)
                    }

                    if (req.body.dateeae != '' && typeof req.body.dateeae != 'undefined') {
                        atrasou = comparaDatas(cronograma.dateeaefim, req.body.dateeae)
                    }

                    if (req.body.datestb != '' && typeof req.body.datestb != 'undefined') {
                        atrasou = comparaDatas(cronograma.datestbfim, req.body.datestb)
                    }

                    if (req.body.datepnl != '' && typeof req.body.datepnl != 'undefined') {
                        atrasou = comparaDatas(cronograma.datepnlfim, req.body.datepnl)
                    }

                    if (req.body.datevis != '' && typeof req.body.datevis != 'undefined') {
                        atrasou = comparaDatas(cronograma.datevisfim, req.body.datevis)
                    }
                    //console.log('req.body.datevis=>' + req.body.datevis)
                    if (req.body.datevis != '' && typeof req.body.datevis != 'undefined') {
                        if (req.body.dateEntregaReal != '' && typeof req.body.dateEntregaReal != 'undifined') {
                            if (comparaDatas(req.body.dateEntregaReal, req.body.datevis)) {
                                erros = erros + 'Não foi possível salvar a nova data de entrega de finalização. '
                            } else {
                                dataEntregaReal = req.body.dateEntregaReal
                                ano = dataEntregaReal.substring(0, 4)
                                mes = dataEntregaReal.substring(5, 7)
                                dia = dataEntregaReal.substring(8, 11)
                                dataEntregaReal = dia + '/' + mes + '/' + ano
                                prj_entrega.datafim = dataEntregaReal
                                prj_entrega.valDataFim = req.body.dateEntregaReal
                                atrasou = comparaDatas(req.body.dateEntregaHidden, req.body.dateEntregaReal)
                            }
                        }
                    }
                    //console.log('req.body.dateEntregaReal=>' + req.body.dateEntregaReal)
                }

                //console.log('req.body.dateentrega=>' + req.body.dateentrega)
                //console.log('req.body.datevisfim=>' + req.body.datevisfim)
                //console.log('req.body.orcado=>' + req.body.orcado)

                if (req.body.orcado == 'true') {
                    //console.log('entrou orçado')
                    if (req.body.datevisfim == '' || typeof req.body.datevisfim == 'undefined') {
                        //console.log('prj_entrega.valDataPrev=>' + prj_entrega.valDataPrev)
                        //console.log('req.body.dateentrega=>' + req.body.dateentrega)
                        if (req.body.dateentrega != '' && typeof req.body.dateentrega != 'undefined' && (req.body.dateentrega != prj_entrega.valDataPrev)) {
                            erros = erros + 'A data de entrega poderá ser alterada quando data final da vistoria estiver preenchida.'
                            req.flash('error_msg', erros)
                            res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                        }
                    } else {
                        if (req.body.dateentrega != '' && typeof req.body.dateentrega != 'undefined' && comparaDatas(req.body.dateentrega, req.body.datevisfim) == false) {
                            dataentrega = req.body.dateentrega
                            ano = dataentrega.substring(0, 4)
                            mes = dataentrega.substring(5, 7)
                            dia = dataentrega.substring(8, 11)
                            dataentrega = dia + '/' + mes + '/' + ano
                            prj_entrega.dataprev = dataentrega
                            prj_entrega.dataord = ano + mes + dia
                            prj_entrega.valDataPrev = req.body.dateentrega
                        }
                    }
                }

                prj_entrega.atrasado = atrasou
                //console.log('atrasou=>' + atrasou)
                //console.log('req.body.dateateini=>' + req.body.dateateini)
                prj_entrega.dataIns = dataMensagem(req.body.dateateini)
                //console.log('dataMensagem(req.body.dateateini)=>' + req.body.dateateini)
                prj_entrega.valDataIns = req.body.dateateini
                prj_entrega.checkAte = checkAte
                prj_entrega.checkInv = checkInv
                prj_entrega.checkMod = checkMod
                prj_entrega.save().then(() => {
                    //console.log('salvou o projeto')
                    if (req.body.executando == 'true') {
                        //---Validar as datas de realização com data estimada do fim da entrega--//
                        if (req.body.datepla != '' && typeof req.body.datepla != 'undefined') {
                            cronograma.atrasouPla = comparaDatas(cronograma.dateplafim, req.body.datepla)
                        } else {
                            cronograma.atrasouPla = false
                        }
                        if (req.body.dateprj != '' && typeof req.body.dateprj != 'undefined') {
                            cronograma.atrasouPrj = comparaDatas(cronograma.dateprjfim, req.body.dateprj)
                        } else {
                            cronograma.atrasouPrj = false
                        }
                        if (req.body.dateate != '' && typeof req.body.dateate != 'undefined') {
                            cronograma.atrasouAte = comparaDatas(cronograma.dateatefim, req.body.dateate)
                        } else {
                            cronograma.atrasouAte = false
                        }
                        if (req.body.dateest != '' && typeof req.body.dateest != 'undefined') {
                            cronograma.atrasouEst = comparaDatas(cronograma.dateestfim, req.body.dateest)
                        } else {
                            cronograma.atrasouEst = false
                        }
                        if (req.body.datemod != '' && typeof req.body.datemod != 'undefined') {
                            cronograma.atrasouMod = comparaDatas(cronograma.datemodfim, req.body.datemod)
                        } else {
                            cronograma.atrasouMod = false
                        }
                        if (req.body.dateinv != '' && typeof req.body.dateinv != 'undefined') {
                            cronograma.atrasouInv = comparaDatas(cronograma.dateinvfim, req.body.dateinv)
                        } else {
                            cronograma.atrasouInv = false
                        }
                        if (req.body.dateeae != '' && typeof req.body.dateeae != 'undefined') {
                            cronograma.atrasouEae = comparaDatas(cronograma.dateeaefim, req.body.dateeae)
                        } else {
                            cronograma.atrasouEae = false
                        }
                        if (req.body.datestb != '' && typeof req.body.datestb != 'undefined') {
                            cronograma.atrasouStb = comparaDatas(cronograma.datestbfim, req.body.datestb)
                        } else {
                            cronograma.atrasouStb = false
                        }
                        if (req.body.datepnl != '' && typeof req.body.datepnl != 'undefined') {
                            cronograma.atrasouPnl = comparaDatas(cronograma.datepnlfim, req.body.datepnl)
                        } else {
                            cronograma.atrasouPnl = false
                        }
                        if (req.body.datevis != '' && typeof req.body.datevis != 'undefined') {
                            cronograma.atrasouVis = comparaDatas(cronograma.datevisfim, req.body.datevis)
                        } else {
                            cronograma.atrasouVis = false
                        }
                    }
                    if (req.body.orcado == 'true') {
                        //console.log('entrou orçado')
                        cronograma.dateplaini = req.body.dateplaini
                        if (req.body.dateplaini != '' && typeof req.body.dateplaini != 'undefined') {
                            cronograma.agendaPlaIni = dataBusca(req.body.dateplaini)
                        }
                        cronograma.dateateini = req.body.dateateini
                        if (req.body.dateateini != '' && typeof req.body.dateateini != 'undefined') {
                            cronograma.agendaAteIni = dataBusca(req.body.dateateini)
                        }
                        cronograma.dateprjini = req.body.dateprjini
                        if (req.body.dateprjini != '' && typeof req.body.dateprjini != 'undefined') {
                            cronograma.agendaPrjIni = dataBusca(req.body.dateprjini)
                        }
                        cronograma.dateestini = req.body.dateestini
                        if (req.body.dateestini != '' && typeof req.body.dateestini != 'undefined') {
                            cronograma.agendaEstIni = dataBusca(req.body.dateestini)
                        }
                        cronograma.datemodini = req.body.datemodini
                        if (req.body.datemodini != '' && typeof req.body.datemodini != 'undefined') {
                            cronograma.agendaModIni = dataBusca(req.body.datemodini)
                        }
                        cronograma.dateinvini = req.body.dateinvini
                        if (req.body.dateinvini != '' && typeof req.body.dateinvini != 'undefined') {
                            cronograma.agendaInvIni = dataBusca(req.body.dateinvini)
                        }
                        cronograma.dateeaeini = req.body.dateeaeini
                        if (req.body.dateeaeini != '' && typeof req.body.dateeaeini != 'undefined') {
                            cronograma.agendaEaeIni = dataBusca(req.body.dateeaeini)
                        }
                        cronograma.datestbini = req.body.datestbini
                        if (req.body.datestbini != '' && typeof req.body.datestbini != 'undefined') {
                            cronograma.agendaStbIni = dataBusca(req.body.datestbini)
                        }
                        cronograma.datepnlini = req.body.datepnlini
                        if (req.body.datepnlini != '' && typeof req.body.datepnlini != 'undefined') {
                            cronograma.agendaPnlIni = dataBusca(req.body.datepnlini)
                        }
                        cronograma.datevisini = req.body.datevisini
                        if (req.body.datevisini != '' && typeof req.body.datevisini != 'undefined') {
                            cronograma.agendaVisIni = dataBusca(req.body.datevisini)
                        }

                        cronograma.dateplafim = req.body.dateplafim
                        if (req.body.dateplafim != '' && typeof req.body.dateplafim != 'undefined') {
                            cronograma.agendaPlaFim = dataBusca(req.body.dateplafim)
                        }
                        cronograma.dateatefim = req.body.dateatefim
                        if (req.body.dateatefim != '' && typeof req.body.dateatefim != 'undefined') {
                            cronograma.agendaAteFim = dataBusca(req.body.dateatefim)
                        }
                        cronograma.dateprjfim = req.body.dateprjfim
                        if (req.body.dateprjfim != '' && typeof req.body.dateprjfim != 'undefined') {
                            cronograma.agendaPrjFim = dataBusca(req.body.dateprjfim)
                        }
                        cronograma.dateestfim = req.body.dateestfim
                        if (req.body.dateestfim != '' && typeof req.body.dateestfim != 'undefined') {
                            cronograma.agendaEstFim = dataBusca(req.body.dateestfim)
                        }
                        cronograma.datemodfim = req.body.datemodfim
                        if (req.body.datemodfim != '' && typeof req.body.datemodfim != 'undefined') {
                            cronograma.agendaModFim = dataBusca(req.body.datemodfim)
                        }
                        cronograma.dateinvfim = req.body.dateinvfim
                        if (req.body.dateinvfim != '' && typeof req.body.dateinvfim != 'undefined') {
                            cronograma.agendaInvFim = dataBusca(req.body.dateinvfim)
                        }
                        cronograma.dateeaefim = req.body.dateeaefim
                        if (req.body.dateeaefim != '' && typeof req.body.dateeaefim != 'undefined') {
                            cronograma.agendaEaeFim = dataBusca(req.body.dateeaefim)
                        }
                        cronograma.datestbfim = req.body.datestbfim
                        if (req.body.datestbfim != '' && typeof req.body.datestbfim != 'undefined') {
                            cronograma.agendaStbFim = dataBusca(req.body.datestbfim)
                        }
                        cronograma.datepnlfim = req.body.datepnlfim
                        if (req.body.datepnlfim != '' && typeof req.body.datepnlfim != 'undefined') {
                            cronograma.agendaPnlFim = dataBusca(req.body.datepnlfim)
                        }
                        cronograma.datevisfim = req.body.datevisfim
                        if (req.body.datevisfim != '' && typeof req.body.datevisfim != 'undefined') {
                            cronograma.agendaVisFim = dataBusca(req.body.datevisfim)
                        }

                        if (req.body.datevisfim != '' && typeof req.body.datevisfim != 'undefined') {
                            if (req.body.dateentrega != '' && typeof req.body.dateentrega != 'undefined' && comparaDatas(req.body.dateentrega, req.body.datevisfim)) {
                                erros = 'A data de entrega deve ser maior ou igual a data final da vistoria.'
                                req.flash('error_msg', erros)
                                res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                            } else {
                                cronograma.dateentrega = req.body.dateentrega
                            }
                        }
                        cronograma.save().then(() => {
                            //console.log('cronograma salvo.')
                            sucesso = sucesso + 'Cronograma salvo com sucesso. '
                            req.flash('error_msg', erros)
                            req.flash('success_msg', sucesso)
                            res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                        }).catch((err) => {
                            req.flash('error_msg', 'Não foi possível salvar o cronograma.')
                            res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                        })

                    }
                    if (req.body.executando == 'true') {
                        //console.log('perges=>' + req.body.perges)
                        var perges = req.body.perges
                        var perkit = req.body.perkit
                        var perins = req.body.perins
                        var perpro = req.body.perpro
                        var perali = req.body.perali
                        var perdes = req.body.perdes
                        var perhtl = req.body.perhtl
                        var percmb = req.body.percmb
                        var percer = req.body.percer
                        var percen = req.body.percen
                        var perpos = req.body.perpos
                        if (perges == '') {
                            perges = 0
                        }
                        if (perkit == '') {
                            perkit = 0
                        }
                        if (perins == '') {
                            perins = 0
                        }
                        if (perpro == '') {
                            perpro = 0
                        }
                        if (perali == '') {
                            perali = 0
                        }
                        if (perdes == '') {
                            perdes = 0
                        }
                        if (perhtl == '') {
                            perhtl = 0
                        }
                        if (percmb == '') {
                            percmb = 0
                        }
                        if (percer == '') {
                            percer = 0
                        }
                        if (percen == '') {
                            percen = 0
                        }
                        if (perpos == '') {
                            perpos = 0
                        }
                        cronograma.perGes = perges
                        cronograma.perKit = perkit
                        cronograma.perIns = perins
                        cronograma.perPro = perpro
                        cronograma.perAli = perali
                        cronograma.perDes = perdes
                        cronograma.perHtl = perhtl
                        cronograma.perCmb = percmb
                        cronograma.perCer = percer
                        cronograma.perCen = percen
                        cronograma.perPos = perpos
                        cronograma.checkPla = checkPla
                        cronograma.checkAte = checkAte
                        cronograma.checkPrj = checkPrj
                        cronograma.checkEst = checkEst
                        cronograma.checkMod = checkMod
                        cronograma.checkInv = checkInv
                        cronograma.checkEae = checkEae
                        cronograma.checkStb = checkStb
                        cronograma.checkPnl = checkPnl
                        cronograma.checkVis = checkVis
                        cronograma.datepla = req.body.datepla
                        cronograma.dateate = req.body.dateate
                        cronograma.dateprj = req.body.dateprj
                        cronograma.dateest = req.body.dateest
                        cronograma.datemod = req.body.datemod
                        cronograma.dateinv = req.body.dateinv
                        cronograma.dateeae = req.body.dateeae
                        cronograma.datestb = req.body.datestb
                        cronograma.datepnl = req.body.datepnl
                        cronograma.datevis = req.body.datevis

                        if ((req.body.datevis != '' && typeof req.body.datevis != 'undefined') && (req.body.dateEntregaReal != '' && typeof req.body.dateEntregaReal != 'undifined')) {
                            if (comparaDatas(req.body.dateEntregaReal, req.body.datevis)) {
                                erros = erros + 'A data de entrega de finalização do projeto deve ser maior ou igual a data de finalização da vistoria.'
                            } else {
                                cronograma.dateEntregaReal = req.body.dateEntregaReal
                            }
                        } else {
                            if ((req.body.datevis == '' || typeof req.body.datevis == 'undefined') && (req.body.dateEntregaReal != '' && typeof req.body.dateEntregaReal != 'undifined')) {
                                erros = erros + 'A data de entrega de finalização somente será aceita após definir a data de finalização da vistoria.'
                            }
                        }

                        //console.log("realizado=>" + realizado)
                        if (realizado != null) {
                            //console.log('entrou realizado')
                            //console.log('totint=>' + totint)
                            //console.log('totges=>' + totges)
                            //console.log('totpro=>' + totpro)
                            //console.log('totali=>' + totali)
                            //console.log('totdes=>' + totdes)
                            //console.log('tothtl=>' + tothtl)
                            //console.log('totcmb=>' + totcmb)
                            //console.log('cercamento=>' + cercamento)
                            //console.log('central=>' + central)
                            //console.log('postecond=>' + postecond)

                            realizado.vlrkit = vlrKitRlz
                            realizado.totint = totint
                            realizado.toteng = toteng
                            realizado.matate = matate
                            realizado.vlremp = vlremp
                            realizado.compon = compon
                            realizado.totges = totges
                            realizado.totpro = totpro
                            realizado.totali = totali
                            realizado.totdes = totdes
                            realizado.tothtl = tothtl
                            realizado.totcmb = totcmb
                            realizado.valorCer = cercamento
                            realizado.valorCen = central
                            realizado.valorPos = postecond
                            realizado.vlrart = 0
                            realizado.desAdm = 0
                            realizado.vlrcom = 0
                            realizado.valor = 0
                            realizado.vlrNFS = 0
                            realizado.custoPlano = 0
                            realizado.lucroLiquido = 0
                            realizado.custofix = 0
                            realizado.cutovar = 0
                            realizado.valorMod = 0
                            realizado.valorInv = 0
                            realizado.valorEst = 0
                            realizado.valorCab = 0
                            realizado.valorDis = 0
                            realizado.valorDPS = 0
                            realizado.valorSB = 0
                            realizado.valorOcp = 0
                            realizado.totalTributos = 0
                            realizado.custoPlano = 0

                            cronograma.save().then(() => {
                                //console.log('cronograma salvo.')
                                realizado.save().then(() => {
                                    sucesso = sucesso + 'Cronograma salvo com sucesso. '
                                    req.flash('error_msg', erros)
                                    req.flash('success_msg', sucesso)
                                    res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possível salvar o projeto.')
                                    res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Não foi possível salvar o cronograma.')
                                res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                            })

                        } else {
                            //console.log('novo realizado')
                            //console.log('req.boy.totint=>' + req.body.totint)
                            const realizado = {
                                user: _id,
                                projeto: req.body.idprojeto,
                                vlrkit: req.body.vlrKitRlz,
                                totint: req.body.totint,
                                toteng: 0,
                                matate: 0,
                                vlrwmp: 0,
                                compon: 0,
                                totges: req.body.totges,
                                totpro: req.body.totpro,
                                totali: req.body.totali,
                                totdes: req.body.totdes,
                                tothtl: req.body.tothtl,
                                totcmb: req.body.totcmb,
                                valorCer: req.body.cercamento,
                                valorCen: req.body.central,
                                valorPos: req.body.postecond,
                                vlrart: 0,
                                desAdm: 0,
                                vlrcom: 0,
                                valor: 0,
                                vlrNFS: 0,
                                custoPlano: 0,
                                lucroLiquido: 0,
                                custofix: 0,
                                cutovar: 0,
                                valorMod: 0,
                                valorInv: 0,
                                valorEst: 0,
                                valorCab: 0,
                                valorDis: 0,
                                valorDPS: 0,
                                valorSB: 0,
                                valorOcp: 0,
                                totalTributos: 0,
                                custoPlano: 0
                            }

                            new Realizado(realizado).save().then(() => {
                                cronograma.save().then(() => {
                                    sucesso = sucesso + 'Cronograma salvo com sucesso. '
                                    req.flash('error_msg', erros)
                                    req.flash('success_msg', sucesso)
                                    res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possível salvar o cronograma.')
                                    res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                                })
                            }).catch((err) => {
                                req.flash('error_msg', 'Não foi posível realizar o projeto.')
                                res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                            })
                        }
                    }
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível salvar o projeto.')
                    res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o projeto realizado.')
                res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o cronograma.')
            res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o projeto.')
        res.redirect('/gerenciamento/cronograma/' + req.body.idprojeto)
    })
})

router.post('/planejamento', ehAdmin, (req, res) => {
    const { _id } = req.user
    // console.log('req.body.id=>' + req.body.id)
    Projeto.findOne({ _id: req.body.id }).then((projeto) => {
        Vistoria.findOne({ projeto: req.body.id }).then((vistoria) => {
            // console.log('vistoria=>' + vistoria)
            if (vistoria != '' && typeof vistoria != 'undefined' && vistoria != null) {
                vistoria.plaQtdMod = req.body.plaQtdMod
                vistoria.plaWattMod = req.body.plaWattMod
                vistoria.plaQtdInv = req.body.plaQtdInv
                vistoria.plaKwpInv = req.body.plaKwpInv
                vistoria.plaDimArea = req.body.plaDimArea
                vistoria.plaQtdString = req.body.plaQtdString
                vistoria.plaModString = req.body.plaModString
                vistoria.plaQtdEst = req.body.plaQtdEst
                vistoria.save().then(() => {
                    projeto.qtdmod = req.body.plaQtdMod
                    projeto.totint = parseFloat(req.body.plaQtdMod) * parseFloat(projeto.rspmod)
                    projeto.save().then(() => {
                        Detalhado.findOne({ projeto: req.body.id }).then((detalhe) => {
                            if (detalhe != '' && typeof detalhe != 'undefined' && detalhe != null) {
                                detalhe.projeto = req.body.id
                                detalhe.unidadeMod = req.body.plaQtdMod
                                detalhe.save().then(() => {
                                    req.flash('success_msg', 'Vistoria salva com sucesso.')
                                    res.redirect('/gerenciamento/vistoriaPla/' + req.body.id)
                                })
                            } else {
                                const detalhe = {
                                    projeto: req.body.id,
                                    unidadeMod: req.body.plaQtdMod
                                }
                                new Detalhado(detalhe).save().then(() => {
                                    projeto.qtdmod = req.body.plaQtdMod
                                    projeto.totint = parseFloat(req.body.plaQtdMod) * parseFloat(projeto.rspmod)
                                    projeto.save().then(() => {
                                        req.flash('success_msg', 'Vistoria salva com sucesso.')
                                        res.redirect('/gerenciamento/vistoriaPla/' + req.body.id)
                                    })

                                })
                            }
                        })
                    })
                })
            } else {
                const vistoria = {
                    user: _id,
                    projeto: req.body.id,
                    plaQtdMod: req.body.plaQtdMod,
                    plaWattMod: req.body.plaWattMod,
                    plaQtdInv: req.body.plaQtdInv,
                    plaKwpInv: req.body.plaKwpInv,
                    plaDimArea: req.body.plaDimArea,
                    plaQtdString: req.body.plaQtdString,
                    plaModString: req.body.plaModString,
                    plaQtdEst: req.body.plaQtdEst
                }
                new Vistoria(vistoria).save().then(() => {
                    Detalhado.findOne({ projeto: req.body.id }).then((detalhe) => {
                        if (detalhe._id != '' && typeof detalhe._id != 'undefined' && detalhe != null) {
                            detalhe.projeto = req.body.id
                            detalhe.unidadeMod = req.body.plaQtdMod
                            detalhe.save().then(() => {
                                projeto.qtdmod = req.body.plaQtdMod
                                projeto.totint = parseFloat(req.body.plaQtdMod) * parseFloat(projeto.rspmod)
                                projeto.save().then(() => {
                                    req.flash('success_msg', 'Vistoria salva com sucesso.')
                                    res.redirect('/gerenciamento/vistoriaPla/' + req.body.id)
                                })
                            })
                        } else {
                            const detalhe = {
                                projeto: req.body.id,
                                unidadeMod: req.body.plaQtdMod
                            }
                            new Detalhado(detalhe).save().then(() => {
                                projeto.qtdmod = req.body.plaQtdMod
                                projeto.totint = parseFloat(req.body.plaQtdMod) * parseFloat(projeto.rspmod)
                                projeto.save().then(() => {
                                    req.flash('success_msg', 'Vistoria salva com sucesso.')
                                    res.redirect('/gerenciamento/vistoriaPla/' + req.body.id)
                                })
                            })
                        }
                    })
                })
            }
        })
    })
})

router.post('/salvarSombra', uploadfoto.single('fotoPlaSombra'), ehAdmin, (req, res) => {

    // Vistoria.findOne({ projeto: req.body.id }).then((vistoria) => {
    Vistoria.findOne({ proposta: req.body.id }).then((vistoria) => {

        // console.log('req.file=>' + req.file.filename)
        var foto
        if (req.file.filename != null) {
            foto = req.file.filename
        } else {
            foto = ''
        }

        console.log('foto=>' + foto)

        vistoria.fotoPlaSombra = foto
        vistoria.plaSombra = 'checked'
        vistoria.dtPlaSombra = dataHoje()
        vistoria.save().then(() => {
            res.redirect('/gerenciamento/visita/' + req.body.id)
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível salvar a vistoria.')
            res.redirect('/gerenciamento/visita/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
        res.redirect('/gerenciamento/visita/' + req.body.id)
    })
})

router.post('/salvarArea', uploadfoto.single('fotoPlaArea'), ehAdmin, (req, res) => {

    // Vistoria.findOne({ projeto: req.body.id }).then((vistoria) => {
    Vistoria.findOne({ proposta: req.body.id }).then((vistoria) => {
        // console.log('req.file=>' + req.file.filename)
        var foto
        if (req.file.filename != null) {
            foto = req.file.filename
        } else {
            foto = ''
        }

        vistoria.fotoPlaArea = foto
        vistoria.plaArea = 'checked'
        vistoria.dtPlaArea = dataHoje()
        vistoria.save().then(() => {
            res.redirect('/gerenciamento/visita/' + req.body.id)
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível salvar a vistoria.')
            res.redirect('/gerenciamento/visita/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
        res.redirect('/gerenciamento/visita/' + req.body.id)
    })
})

router.post('/salvarInvStb', uploadfoto.single('fotoPlaInvStb'), ehAdmin, (req, res) => {

    // Vistoria.findOne({ projeto: req.body.id }).then((vistoria) => {
    Vistoria.findOne({ proposta: req.body.id }).then((vistoria) => {
        // console.log('req.file=>' + req.file.filename)
        var foto
        if (req.file.filename != null) {
            foto = req.file.filename
        } else {
            foto = ''
        }

        vistoria.fotoPlaInvStb = foto
        vistoria.plaInvStb = 'checked'
        vistoria.dtPlaInvStb = dataHoje()
        vistoria.save().then(() => {
            res.redirect('/gerenciamento/visita/' + req.body.id)
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível salvar a vistoria.')
            res.redirect('/gerenciamento/visita/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
        res.redirect('/gerenciamento/visita/' + req.body.id)
    })
})

router.post('/salvarAte', uploadfoto.single('fotoPlaAte'), ehAdmin, (req, res) => {

    // Vistoria.findOne({ projeto: req.body.id }).then((vistoria) => {
    Vistoria.findOne({ proposta: req.body.id }).then((vistoria) => {
        // console.log('req.file=>' + req.file.filename)
        var foto
        if (req.file.filename != null) {
            foto = req.file.filename
        } else {
            foto = ''
        }

        vistoria.fotoPlaAte = foto
        vistoria.plaAte = 'checked'
        vistoria.dtPlaAte = dataHoje()
        vistoria.save().then(() => {
            res.redirect('/gerenciamento/visita/' + req.body.id)
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível salvar a vistoria.')
            res.redirect('/gerenciamento/visita/' + req.body.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a vistoria.')
        res.redirect('/gerenciamento/visita/' + req.body.id)
    })
})

router.get('/vistoriaAte/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/aterramento', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrar a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrar a projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaStb/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/stringbox', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrar a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrar o projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaInv/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/inversor', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrar a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrar o projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaEst/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/estrutura', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrar a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrar o projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaMod/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/modulo', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrar a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrar o projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaPla/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        //console.log('projeto._id=>' + projeto._id)
        Vistoria.findOne({ projeto: projeto._id }).lean().then((vistoria) => {
            Detalhado.findOne({ projeto: req.params.id }).lean().then((detalhe) => {
                Componente.find().lean().then((componentes) => {
                    if (detalhe._id != '' && typeof detalhe != 'undefined') {
                        // console.log('vistoria.fotoPlaSombra=>' + vistoria.fotoPlaSombra)
                        res.render('vistoria/planejamento', { projeto, vistoria, detalhe, componentes })
                    } else {
                        res.render('vistoria/planejamento', { projeto, vistoria })
                    }
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi encontrado o componente.')
                    res.redirect('/menu/')
                })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi encontrado os detalhes.')
                res.redirect('/menu/')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrado a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrado o projeto.')
        res.redirect('/menu/')
    })
})

router.get('/vistoriaFinal/:id', ehAdmin, (req, res) => {
    Projeto.findOne({ _id: req.params.id }).lean().then((projeto) => {
        Vistoria.findOne({ projeto: req.params.id }).lean().then((vistoria) => {
            res.render('vistoria/vistoriaFinal', { projeto, vistoria })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi encontrado a vistoria.')
            res.redirect('/menu/')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi encontrado o projeto.')
        res.redirect('/menu/')
    })
})

module.exports = router