const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

require('../model/Cliente')
require('../model/Projeto')
require('../model/Tarefas')
require('../model/Plano')
require('../model/Proposta')
require('../model/Atividade')
require('../model/Programacao')
require('../model/Pessoa')
require('../model/Usuario')
require('../model/Acesso')
const Cliente = mongoose.model('cliente')
const Usina = mongoose.model('usina')
const Tarefa = mongoose.model('tarefas')
const Plano = mongoose.model('plano')
const Proposta = mongoose.model('proposta')
const Atividade = mongoose.model('atividade')
const Programacao = mongoose.model('programacao')
const Usuario = mongoose.model('usuario')
const Acesso = mongoose.model('acesso')

const naoVazio = require('../resources/naoVazio')
const dataBusca = require('../resources/dataBusca')
const comparaDatas = require('../resources/comparaDatas')
const validaCronograma = require('../resources/validaCronograma')
const liberaRecursos = require('../resources/liberaRecursos')
const setData = require('../resources/setData')
const dataMensagem = require('../resources/dataMensagem')
const dataHoje = require('../resources/dataHoje')
const { ehAdmin } = require('../helpers/ehAdmin')

router.get('/consulta', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    Cliente.find({ user: id }).lean().then((clientes) => {
        res.render('cliente/findclientes', { clientes: clientes })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar os clientes.')
        res.redirect('/cliente/novo')
    })
})

router.get('/programacao/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    const { nome } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }

    var tarefas = []
    var q = 0
    Atividade.find({ user: id }).lean().then((atividades) => {
        Usina.findOne({ _id: req.params.id }).lean().then((usina) => {
            Cliente.findOne({ _id: usina.cliente }).lean().then((cliente) => {
                if (naoVazio(atividades)) {
                    Tarefa.find({ usina: req.params.id, concluido: false, responsavel: id, programacao: { $exists: true } }).then((t) => {
                        if (naoVazio(t)) {
                            t.forEach((e) => {
                                Atividade.findOne({ _id: e.servico }).then((atv) => {
                                    //console.log('e._id=>' + e._id)
                                    q++
                                    tarefas.push({ id: e._id, usina: usina._id, seq: q, dataini: e.dataini, idser: atv._id, servico: atv.descricao, responsavel: nome })
                                    if (q == t.length) {
                                        res.render('cliente/programacao', { usina, atividades, tarefas, cliente, tipo: 'auto' })
                                    }
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possível encontrar a atividade.')
                                    res.redirect('/cliente/novo')
                                })
                            })
                        } else {
                            res.render('cliente/programacao', { usina, atividades, cliente, tipo: 'auto' })
                        }
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a tarefa.')
                        res.redirect('/cliente/novo')
                    })
                } else {
                    req.flash('error_msg', 'Não encontramos atividades cadastradas. Acesse o módulo de manutenção e cadastre atividades.')
                    res.redirect('/menu')
                }
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                res.redirect('/cliente/novo')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o usina.')
            res.redirect('/cliente/novo')
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar as atividades.')
        res.redirect('/cliente/novo')
    })
})

router.get('/novo', ehAdmin, (req, res) => {
    res.render('cliente/cliente')
})

router.post('/novo', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    var erros = []

    if (req.body.cnpj != '') {
        documento = req.body.cnpj
    } else {
        documento = req.body.cpf
    }
    if (req.body.nome == '' || req.body.endereco == '' || req.body.cidade == '' ||
        req.body.uf == '' || documento == '' ||
        req.body.celular == '') {
        erros.push({ texto: 'Os campos de: nome, endereço, cidade, estado e um telefone são obrigatórios.' })
        res.render('cliente/cliente', { erros: erros })
    } else {
        var cnpj
        var cpf
        if (req.body.cnpj != '') {
            cnpj = req.body.cnpj
        }
        if (req.body.cpf != '') {
            cpf = req.body.cpf
        }

        var sissolar
        var posvenda
        if (req.body.checkSolar != null) {
            sissolar = 'checked'
        } else {
            sissolar = 'unchecked'
        }
        if (req.body.checkPos != null) {
            posvenda = 'checked'
        } else {
            posvenda = 'unchecked'
        }

        const cliente = {
            user: id,
            nome: req.body.nome,
            endereco: req.body.endereco,
            cidade: req.body.cidade,
            uf: req.body.uf,
            cnpj: cnpj,
            cpf: cpf,
            celular: req.body.celular,
            email: req.body.email,
            sissolar: sissolar,
            posvenda: posvenda
        }

        new Cliente(cliente).save().then(() => {
            var sucesso = []
            sucesso.push({ texto: 'Cliente adicionado com sucesso' })
            Cliente.findOne({ user: id }).sort({ field: 'asc', _id: -1 }).lean().then((cliente) => {
                res.render('cliente/cliente', { sucesso, cliente })
            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                res.redirect('/cliente/novo')
            })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível cadastrar o cliente.')
            res.redirect('/cliente/novo')
        })
    }
})

router.get('/edicao/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    Cliente.findOne({ user: id, _id: req.params.id }).lean().then((cliente) => {
        res.render('cliente/cliente', { cliente })
    })
})

router.get('/historico/:id', ehAdmin, (req, res) => {
    var qcont = 0
    var total = 0
    var q = 0
    var emaberto = []
    var concluido = []
    var temtarefa = false
    Cliente.findOne({ _id: req.params.id }).lean().then((cliente) => {
        Usina.find({ cliente: req.params.id }).then((usina) => {
            //console.log('usina=>'+usina)
            if (naoVazio(usina)) {
                usina.forEach((e) => {
                    Tarefa.find({ usina: e._id }).then((tarefas) => {
                        //console.log('tarefas=>'+tarefas)
                        // if (naoVazio(tarefas)) {
                            tarefas.forEach((et) => {
                                Atividade.findOne({ _id: et.servico }).then((atv) => {
                                    temtarefa = true
                                    q++
                                    //console.log('et.concluido=>' + et.concluido)
                                    // //console.log('e.nome=>' + e.nome)
                                    // //console.log('et.servico=>' + et.servico)
                                    if (et.concluido == false) {
                                        emaberto.push({ id: et._id, usina: e.nome, servico: atv.descricao, dataini: dataMensagem(et.dataini), datafim: dataMensagem(et.datafim), situacao: "Em aberto" }) 
                                    } else {
                                        concluido.push({ id: et._id, usina: e.nome, servico: atv.descricao, dataini: dataMensagem(et.dataini), datafim: dataMensagem(et.datafim), situacao: "Realizado" })
                                    }
                                    qcont = q * usina.length
                                    total = usina.length * tarefas.length
                                    if (qcont == total) {
                                        //console.log('emaberto=>'+emaberto)
                                        //console.log('concluido=>'+concluido)
                                        //console.log('entrou')
                                        res.render('cliente/historico', { emaberto, concluido, cliente })
                                    }
                                }).catch((err) => {
                                    req.flash('error_msg', 'Não foi possível encontrar a atividade.')
                                    res.redirect('/cliente/edicao/' + req.params.id)
                                })
                            })
                            if (temtarefa == false){
                                res.render('cliente/historico', { emaberto, concluido, cliente })
                            }
                        // } else {
                        //     res.render('cliente/historico', { cliente })
                        // }
                    }).catch((err) => {
                        req.flash('error_msg', 'Não foi possível encontrar a tarefa.')
                        res.redirect('/cliente/edicao/' + req.params.id)
                    })
                })
            } else {
                res.render('cliente/historico', { cliente })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar a usina.')
            res.redirect('/cliente/edicao/' + req.params.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar o cliente.')
        res.redirect('/cliente/edicao/' + req.params.id)
    })

})

router.get('/confirmaexclusao/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    Proposta.find({ user: id, cliente: req.params.id }).then((proposta) => {
        if (naoVazio(proposta)) {
            req.flash('aviso_msg', 'Cliente vinculado a proposta(s). Impossível excluir.')
            res.redirect('/cliente/consulta')
        } else {
            Cliente.findOne({ user: id, _id: req.params.id }).lean().then((cliente) => {
                res.render('cliente/confirmaexclusao', { cliente: cliente })
            }).catch((err) => {
                req.flash('error_msg', 'Houve um erro ao encontrar o Cliente.')
                res.redirect('/cliente/consulta')
            })
        }
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao encontrar a Proposta.')
        res.redirect('/menu')
    })
})

router.get('/usinas/:id', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    var lista_usina = []
    var qu = 0
    var nome_plano
    var mensalidade
    Plano.find({ user: id }).lean().then((lista_plano) => {
        Cliente.findOne({ user: id, _id: req.params.id }).lean().then((cliente) => {
            Usina.find({ user: id, cliente: req.params.id }).then((usina) => {
                ////console.log('usina=>' + usina)
                if (typeof usina != 'unedined' && usina != '') {
                    usina.forEach((element) => {
                        ////console.log('element.plano=>' + element.plano)
                        if (naoVazio(element.plano)) {
                            Plano.findOne({ _id: element.plano }).then((plano) => {
                                nome_plano = plano.nome
                                mensalidade = plano.mensalidade
                            }).catch((err) => {
                                req.flash('error_msg', 'Houve uma falha ao encontrar o plano.')
                                res.redirect('/cliente/usinas/' + req.params.id)
                            })
                        }
                        qu++
                        lista_usina.push({ _id: element._id, cliente: element.cliente, datalimp: element.datalimp, datarevi: element.datarevi, cadastro: element.cadastro, classificacao: element.classificacao, tipo: element.tipo, nome_plano, mensalidade, nome: element.nome, endereco: element.endereco, area: element.area, qtdmod: element.qtdmod })
                        ////console.log('qu=>' + qu)
                        ////console.log('usina.length=>' + usina.length)
                        if (usina.length == qu) {
                            res.render('cliente/usina', { cliente, lista_usina, lista_plano })
                        }

                    })
                } else {
                    res.render('cliente/usina', { cliente, lista_plano })
                }

            }).catch((err) => {
                req.flash('error_msg', 'Houve uma falha ao encontrar a usina.')
                res.redirect('/cliente/usinas/' + req.params.id)
            })
        }).catch((err) => {
            req.flash('error_msg', 'Houve uma falha ao encontrar o cliente.')
            res.redirect('/cliente/usinas/' + req.params.id)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve uma falha ao encontrar o plano.')
        res.redirect('/cliente/usinas/' + req.params.id)
    })
})

router.get('/excluirusina/:id', (req, res) => {
    ////console.log('entrou')
    Usina.findOne({ _id: req.params.id }).then((usina_cliente) => {
        Usina.findOneAndDelete({ _id: req.params.id }).then(() => {
            ////console.log('id cliente=>' + usina_cliente.cliente)
            req.flash('success_msg', 'Usina removida com sucesso!')
            res.redirect('/cliente/usinas/' + usina_cliente.cliente)
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível excluir a usina.')
            res.redirect('/cliente/usinas/' + usina_cliente.cliente)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Não foi possível encontrar a usina.')
        res.redirect('/cliente/usinas/' + usina_cliente.cliente)
    })

})

router.post('/edicao/', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    var erros = []
    var documento

    if (req.body.cnpj != '') {
        documento = req.body.cnpj
    } else {
        documento = req.body.cpf
    }

    if (req.body.nome == '' || req.body.endereco == '' || documento == '' ||
        req.body.celular == '' || req.body.email == '') {
        erros.push({ texto: 'Todos os campos de descrição são obrigatórios.' })
        Cliente.findOne({ user: id, _id: req.body.id }).lean().then((cliente) => {
            res.render('cliente/editcliente', { cliente: cliente, erros: erros })
        }).catch((err) => {
            req.flash('error_msg', 'Não foi possível encontrar o cliente.')
            res.redirect('/Cliente/novo')
        })

    } else {

        var sissolar
        var posvenda
        if (req.body.checkSolar != null) {
            sissolar = 'checked'
        } else {
            sissolar = 'unchecked'
        }
        if (req.body.checkPos != null) {
            posvenda = 'checked'
        } else {
            posvenda = 'unchecked'
        }

        Cliente.findOne({ user: id, _id: req.body.id }).then((cliente) => {

            if (req.body.uf != '' && req.body.uf != cliente.uf) {
                cliente.uf = req.body.uf
            }
            if (req.body.cidade != '' && req.body.uf != cliente.cidade) {
                cliente.cidade = req.body.cidade
            }

            cliente.nome = req.body.nome
            cliente.endereco = req.body.endereco
            cliente.celular = req.body.celular
            cliente.email = req.body.email
            cliente.sissolar = sissolar
            cliente.posvenda = posvenda
            if (cliente.cnpj != '') {
                cliente.cnpj = req.body.cnpj
            } else {
                cliente.cpf = req.body.cpf
            }

            cliente.save().then(() => {
                var sucesso = []
                sucesso.push({ texto: 'Modificações salvas com sucesso.' })

                Cliente.findOne({ user: id, _id: req.body.id }).lean().then((cliente) => {
                    res.render('cliente/editcliente', { cliente, sucesso })
                }).catch((err) => {
                    req.flash('error_msg', 'Não foi possível encontrar o cliente.')
                    res.redirect('/Cliente/novo')
                })

            }).catch((err) => {
                req.flash('error_msg', 'Não foi possível salvar as modificações.')
                res.redirect('/Cliente/novo')
            })

        })
    }
})

router.post('/geraprograma/', ehAdmin, (req, res) => {

    var id
    const { _id } = req.user
    const { user } = req.user
    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }

    var tempo = req.body.tempo
    var inter = req.body.intervalo
    var perini = req.body.periodoini
    var perfim = req.body.periodofim

    var freq
    var add
    var novadataini
    var novadatafim
    var data1
    var data2
    var mes
    var dia
    var ano

    data1 = new Date(perfim)
    data2 = new Date(perini)
    var diff = Math.abs(data1.getTime() - data2.getTime())
    ////console.log('diff=>' + diff)
    var days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    ////console.log('days=>' + days)

    ////console.log('tempo=>' + tempo)

    if (tempo == 'horas') {
        freq = Math.round((days * 24) / inter)
        add = inter / 24
    } else {
        if (tempo == 'meses') {
            freq = Math.round(days / 30 / inter)
            add = inter * 30
        } else {
            freq = Math.round(days / inter)
            add = parseFloat(inter)
        }
    }

    ////console.log('freq=>' + freq)
    ////console.log('add=>' + add)

    ////console.log('id=>' + id)
    ////console.log('req.body.usina=>' + req.body.usina)
    ////console.log('req.body.atividade=>' + req.body.atividade)
    ////console.log('req.body.tipo=>' + req.body.tipo)
    ////console.log('req.body.tempo=>' + req.body.tempo)
    ////console.log('req.body.inter=>' + inter)
    ////console.log('perini=>' + dataBusca(perini))
    ////console.log('perfim=>' + dataBusca(perfim))
    ////console.log('data>' + dataHoje())
    const programa = {
        user: id,
        usina: req.body.usina,
        atividade: req.body.atividade,
        tipo: req.body.tipo,
        tempo: tempo,
        intervalo: inter,
        periodoini: dataBusca(perini),
        periodofim: dataBusca(perfim),
        data: dataHoje()
    }
    new Programacao(programa).save().then(() => {
        ////console.log('salvou')
        Programacao.findOne({ user: id }).sort({ field: 'asc', _id: -1 }).then((prog) => {
            ////console.log('prog=>' + prog._id)
            for (i = 0; i < freq; i++) {
                if (i == 0) {
                    novadataini = perini
                    //console.log('add=>' + add)
                    novadatafim = setData(novadataini, add)
                    mes = novadatafim.substring(5, 7)
                    //console.log('mes')
                    if (parseFloat(mes) == 0) {
                        dia = novadatafim.substring(8, 10)
                        mes = '12'
                        ano = novadatafim.substring(0, 4)
                        novadatafim = ano + '-' + mes + '-' + dia
                    }

                } else {
                    novadataini = novadatafim
                    novadatafim = setData(novadatafim, add)
                    mes = novadatafim.substring(5, 7)
                    //console.log('mes=>' + mes)
                    if (parseFloat(mes) == 0) {
                        dia = novadatafim.substring(8, 10)
                        mes = '12'
                        ano = novadatafim.substring(0, 4)
                        novadatafim = ano + '-' + mes + '-' + dia
                    }
                }
                //console.log('novadataini=>' + novadataini)
                //console.log('novadatafim=>' + novadatafim)
                new Tarefa({
                    user: id,
                    usina: req.body.usina,
                    responsavel: _id,
                    programacao: prog._id,
                    servico: req.body.atividade,
                    concluido: false,
                    dataini: novadataini,
                    datafim: novadatafim,
                    buscadatafim: dataBusca(novadatafim),
                    cadastro: dataHoje()
                }).save().then(() => {
                    ////console.log('i=>' + i)
                    if (i == freq) {
                        ////console.log('entrou')
                        res.redirect('/cliente/programacao/' + req.body.usina)
                    }
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao salvar a tarefa.')
                    res.redirect('/cliente/usinas/' + req.body.idcliente)
                })
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao encontrar a programação.')
            res.redirect('/cliente/usinas/' + req.body.idcliente)
        })
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a programação.')
        res.redirect('/cliente/usinas/' + req.body.idcliente)
    })
})

router.post('/salvartarefa', ehAdmin, (req, res) => {
    Tarefa.findOne({ _id: req.body.id }).then((t) => {
        if (req.body.concluido == 'Sim') {
            t.concluido = true
        } else {
            t.concluido = false
        }
        t.dataini = String(req.body.dataini)
        t.buscadataini = dataBusca(req.body.dataini)
        t.servico = req.body.atividade
        t.save().then(() => {
            res.redirect('/cliente/programacao/' + req.body.usina)
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a tarefa.')
            res.redirect('/cliente/programacao/' + req.body.usina)
        })
    })
})

router.post('/addusina/', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    var plano = {}
    var usina = {}
    var cadastro = dataHoje()
    var datalimp = dataMensagem(setData(dataHoje(), 182))
    var buscalimp = dataBusca(setData(dataHoje(), 182))
    var datarevi = dataMensagem(setData(dataHoje(), 30))
    var buscarevi = dataBusca(setData(dataHoje(), 30))

    ////console.log('req.body.plano=>' + req.body.plano)

    const corpo = {
        user: id,
        nome: req.body.nome,
        endereco: req.body.endereco,
        cliente: req.body.id,
        classificacao: req.body.classUsina,
        tipo: req.body.tipoUsina,
        area: req.body.area,
        qtdmod: req.body.qtdmod,
        cadastro: cadastro,
        datalimp: datalimp,
        buscalimp: buscalimp,
        datarevi: datarevi,
        buscarevi: buscarevi
    }

    if (req.body.plano != '' && req.body.plano != 'Serviço Único') {
        plano = { plano: req.body.plano }
        usina = Object.assign(plano, corpo)
    } else {
        usina = corpo
    }

    new Usina(usina).save().then(() => {
        req.flash('success_msg', 'Usina adcionada com sucesso.')
        res.redirect('/cliente/usinas/' + req.body.id)
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao salvar a usina.')
        res.redirect('/cliente/usinas/' + req.body.idcliente)
    })
})

router.post('/editusina', (req, res) => {
    ////console.log('idusina=>' + req.body.idusina)
    ////console.log('req.body.plano=>' + req.body.plano)
    Usina.findOne({ _id: req.body.idusina }).then((usina) => {
        usina.nome = req.body.nome
        usina.endereco = req.body.endereco
        usina.cadastro = req.body.cadastro
        usina.area = req.body.area
        usina.qtdmod = req.body.qtdmod
        usina.classificacao = req.body.classUsina
        usina.tipo = req.body.tipoUsina
        if (naoVazio(req.body.plano) && req.body.plano != 'Serviço Único') {
            usina.plano = req.body.plano
        }
        usina.save().then(() => {
            req.flash('succes_msg', 'Usina salva com sucesso.')
            res.redirect('/cliente/usinas/' + req.body.idcliente)
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a usina.')
            res.redirect('/cliente/usinas/' + req.body.idcliente)
        })
    })
})

router.get('/remover/:id', ehAdmin, (req, res) => {
    const { user } = req.user
    const { _id } = req.user
    var id
    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }

    Cliente.findOneAndDelete({ _id: req.params.id }).then(() => {
        req.flash('success_msg', 'Cliente excluido com sucesso')
        res.redirect('/cliente/consulta')
    }).catch((err) => {
        req.flash('error_msg', 'Houve um erro ao excluir a Cliente.')
        res.redirect('/consulta')
    })

})

router.post('/filtrar', ehAdmin, (req, res) => {
    const { _id } = req.user
    const { user } = req.user
    var id

    if (typeof user == 'undefined') {
        id = _id
    } else {
        id = user
    }
    var cidade = req.body.cidade
    var uf = req.body.uf
    var nome = req.body.nome

    if (nome != '' && uf != '' && cidade != '') {
        Cliente.find({ nome: new RegExp(nome), uf: new RegExp(uf), cidade: new RegExp(cidade), user: id }).lean().then((clientes) => {
            res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
        })
    } else {
        if (nome == '' && cidade == '' && uf == '') {
            Cliente.find({ user: id }).lean().then((clientes) => {
                res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
            })
        } else {
            if (nome == '' && cidade == '') {
                Cliente.find({ uf: new RegExp(uf), user: id }).lean().then((clientes) => {
                    res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                })
            } else {
                if (nome == '' && uf == '') {
                    Cliente.find({ cidade: new RegExp(cidade), user: id }).lean().then((clientes) => {
                        res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                    })
                } else {
                    if (cidade == '' && uf == '') {
                        Cliente.find({ nome: new RegExp(nome), user: id }).lean().then((clientes) => {
                            res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                        })
                    } else {
                        if (cidade == '') {
                            Cliente.find({ nome: new RegExp(nome), uf: new RegExp(uf), user: id }).lean().then((clientes) => {
                                res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                            })
                        } else {
                            if (uf == '') {
                                Cliente.find({ nome: new RegExp(nome), cidade: new RegExp(cidade), user: id }).lean().then((Clientes) => {
                                    res.render('cliente/findclientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                                })
                            } else {
                                Cliente.find({ cidade: new RegExp(cidade), uf: new RegExp(uf), user: id }).lean().then((clientes) => {
                                    res.render('cliente/findClientes', { clientes: clientes, cidade: cidade, uf: uf, nome: nome })
                                })
                            }
                        }
                    }
                }
            }
        }
    }
})

module.exports = router