import express, { Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import knex, { Knex } from "knex";
import "dotenv/config";
import bcrypt from "bcrypt";
import fs from "fs";

const server = express();

const corsOptions = {
  origin: "https://www.immobiliaresp.com.br",
  credentials: true,
  optionsSuccessStatus: 200,
};

server.use(cors(corsOptions));
server.use(express.json());

//localhost:3000/public/images/sadfsdffaf

//conexão com o banco de dados
const db = knex({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: process.env.SENHA_MYSQL,
    database: "immobiliare",
  },
});

server.post("/login", async (req: Request, res: Response) => {
  const { emailLogin, senhaLogin } = req.body;

  try {
    let arrUser = await db("login").where({ emaillogin: emailLogin }).select();

    console.log(arrUser);

    if (arrUser.length == 0) {
      res.status(401).json(["erro", "email errado"]);
      return;
    }

    bcrypt.compare(senhaLogin, arrUser[0].senhalogin, function (err, resp) {
      console.log("entrou na fn");
      console.log(resp);
      if (resp) {
        res.json(["sucesso"]);
      } else {
        res.status(401).json(["erro", "senha errada"]);
      }
    });
  } catch {
    res.status(400).json(["erro"]);
  }
});

server.use(express.static(path.resolve("public")));

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

server.post(
  "/cadastrarNovoImovel",
  upload.array("files"),
  async (req: Request, res: Response) => {
    type bodyType = {
      bairro: string;
      tipoImovel: string;
      metragem: string;
      metragemFinal: string;
      numQuartos: string;
      numQuartosFinal: string;
      numSuites: string;
      numSuitesFinal: string;
      numVagas: string;
      preco: string;
      codigo: string;
    };

    type fileType = {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
    };

    const {
      bairro,
      tipoImovel, 
      metragem,
      metragemFinal,
      numQuartos,
      numQuartosFinal,
      numSuites,
      numSuitesFinal,
      numVagas,
      preco,
      codigo,
      numFotos,
    } = req.body;

    let arrFilenames: string[] = [];

    (req.files as Array<Express.Multer.File>).map(
      (item: { filename: string }) => arrFilenames.push(item.filename)
    );

    arrFilenames.forEach((item) => {
      console.log(item);
    });

    let arrCodigos: { codigo: string }[] = await db
      .select("codigo")
      .from("imoveis");
    let codigoIgual = arrCodigos.some((item) => item.codigo == codigo);
    if (codigoIgual) {
      res.json(["erro", "essa casa já está cadastrada"]);
    } else {
      try {
        await db("imoveis").insert([
          {
            bairro,
            tipoimovel: tipoImovel,
            metragem,
            metragemfinal: metragemFinal,
            numquartos: numQuartos,
            numquartosfinal: numQuartosFinal,
            numsuites: numSuites,
            numsuitesfinal: numSuitesFinal,
            numvagas: numVagas,
            preco,
            codigo,
          },
        ]);
      } catch (err) {
        console.log(err);
        res.json([
          "erro",
          "imóvel não conseguiu ser inserido. Problema na inserção do banco de dados. Tente novamente, caso persista falar com Rafael",
        ]);
      }

      try {
        let idImovelAtual = await db("imoveis").select("id").where({ codigo });
        console.log(idImovelAtual);
        arrFilenames.forEach(async (item, index) => {
          await db("imagens").insert([
            {
              slide: index == 0,
              id_imovel: idImovelAtual[0].id,
              path_imagem: item,
            },
          ]);
        });
        res.json(["sucesso"]);
      } catch (err) {
        console.log("antes do condsole err");
        console.log(err);
        //deu errado, então deleta todas as imagens já adicionadas e o imóvel
        console.log("antes do idIMovel");
        let idImovelAtual = await db("imoveis").select("id").where({ codigo });
        console.log("dps do idIMovel");
        await db("imagens").where({ id_imovel: idImovelAtual[0].id }).del();
        await db("imoveis").where({ id: idImovelAtual[0].id }).del();
        res.json([
          "erro",
          "imóvel não conseguiu ser inserido. Problema na inserção do banco de dados. Tente novamente, caso persista falar com Rafael",
        ]);
      }
    }
  }
);


server.get("/pegarBairros", async (req: Request, res: Response) => {
  let arrBairros = await db.select("bairro").from("bairros");
  res.json(arrBairros);
});

server.get("/pegarTipos", async (req: Request, res: Response) => {
  let arrTipos = await db.select("tipoimovel").from("tipoimoveis");
  res.json(arrTipos);
});

server.get("/pegarImagens", async (req: Request, res: Response) => {});

server.post("/novoBairro", async (req: Request, res: Response) => {
  type bodyType = {
    novoBairro: string;
  };

  const { novoBairro }: bodyType = req.body;

  try {
    await db("bairros").insert({ bairro: novoBairro });
    res.json(["sucesso"]);
  } catch (err) {
    //aqui engloba erros de inserção como não poder inserir pq o bairro já existe, mas também pode ter ocorrido simplismente um problema no banco de dados etc
    res.json(["erro"]);
  }
});

server.post("/novoTipo", async (req: Request, res: Response) => {
  type bodyType = {
    novoTipo: string;
  };

  const { novoTipo }: bodyType = req.body;

  try {
    await db("tipoimoveis").insert({ tipoimovel: novoTipo });
    res.json(["sucesso"]);
  } catch (err) {
    //aqui engloba erros de inserção como não poder inserir pq o bairro já existe, mas também pode ter ocorrido simplismente um problema no banco de dados etc
    res.json(["erro"]);
  }
});

server.get("/pegarFotosSlide", async (req: Request, res: Response) => {
  type objPath = { path_imagem: string; id_imovel: string };

  try {
    let arrayobjFotos: objPath[] = await db("imagens")
      .select("path_imagem", "id_imovel")
      .where({ slide: true });
    let arrayFotos: string[][] = [];

    for (let i = 0; i < arrayobjFotos.length; i++) {
      let item = arrayobjFotos[i];
      arrayFotos.push([
        process.env.API_URL + "/images/" + item.path_imagem,
        item.id_imovel,
      ]);
    }

    res.json(arrayFotos);
  } catch (err) {
    res.json(["erro", "não foi possível pegar as imagens"]);
  }
});

server.get("/infoImoveis", async (req: Request, res: Response) => {
  type objRespType = {
    id: string;
    bairro: string;
    tipoimovel: string;
    metragem: string;
    metragemfinal: string;
    numquartos: string;
    numsuites: string;
    numvagas: string;
    preco: string;
    codigo: string;
    descricao: string;
  };

  type resType = objRespType[];

  try {
    let arrInfoFotos = await db("imoveis").select();
    res.json(["sucesso", arrInfoFotos]);
  } catch (err) {
    console.log(err);
    res.json(["erro"]);
  }
});

server.post("/pesquisaImoveis", async (req: Request, res: Response) => {
  type bodyType = {
    bairrosPesquisa: string[];
    tiposPesquisa: string[];
  };

  type arrRespostaType = {
    id: string;
    imagens: string[];
  };

  const { bairrosPesquisa, tiposPesquisa } = req.body;

  console.log(bairrosPesquisa)
  console.log(tiposPesquisa)

  try {
    console.log(bairrosPesquisa.length)
    console.log(tiposPesquisa.length)
    console.log(bairrosPesquisa.length > 0 && tiposPesquisa > 0)
    let idsPesquisa;
    if(bairrosPesquisa.length > 0 && tiposPesquisa.length > 0){
      console.log("escolheu os dois")

        idsPesquisa = await db("imoveis").select("id").whereIn("bairro", bairrosPesquisa).whereIn("tipoimovel", tiposPesquisa);

        console.log(idsPesquisa)
    } else if (bairrosPesquisa.length == 0 && tiposPesquisa.length > 0) {
      idsPesquisa = await db("imoveis")
        .select("id")
        .whereIn("tipoimovel", tiposPesquisa);
    } else if (bairrosPesquisa.length > 0 && tiposPesquisa.length == 0) {
      idsPesquisa = await db("imoveis")
        .select("id")
        .whereIn("bairro", bairrosPesquisa);
    } else {
      idsPesquisa = await db("imoveis").select("id");
    }

    let arrResposta: arrRespostaType[] = [];

    for (let i = 0; i < idsPesquisa.length; i++) {
      let item = idsPesquisa[i];
      let objImagens = await db("imagens")
        .select("path_imagem")
        .where({ id_imovel: item.id });
      console.log(objImagens);
      let arrFotosAtual: string[] = [];
      objImagens.forEach((item) => {
        arrFotosAtual.push(process.env.API_URL + "/images/" + item.path_imagem);
      });
      let objResposta = { id: item.id, imagens: arrFotosAtual };
      arrResposta.push(objResposta);
    }

    res.json(["sucesso", arrResposta]);
  } catch (err) {
    res.json(["erro", "erro ao buscar os imoveis, tente novamente"]);
  }
});

server.post("/pesquisaImoveisId", async (req: Request, res: Response) => {
  type bodyType = {
    id: string;
  };

  type arrRespostaType = {
    id: string;
    imagens: string[];
  };

  const { id }: bodyType = req.body;

  try {
    let arrImagens = await db("imagens")
      .select("path_imagem")
      .where({ id_imovel: id });
    let arrFinalImgs = [];
    for (let i = 0; i < arrImagens.length; i++) {
      let item = arrImagens[i];
      arrFinalImgs.push(process.env.API_URL + "/images/" + item.path_imagem);
    }

    res.json(["sucesso", [{ id, imagens: arrFinalImgs }]]);
  } catch (err) {
    res.json([
      "erro",
      "ocorreu um erro ao buscar as imagens desse imóvel, por favor tente novamente",
    ]);
  }
});

//ROTAS DE DELETAR

server.post("/deletarItem", async (req: Request, res: Response) => {
  type bodyType = {
    id: string;
  };

  type objPathType = {path_imagem: string}

  const { id }: bodyType = req.body;

    try{
        let arrPathsImgsRemover: objPathType[] = []
        await db.transaction(async (trx) => {
            arrPathsImgsRemover = await trx("imagens").select("path_imagem").where({id_imovel: id})

            let arrRespImgs = await trx("imagens").where({id_imovel: id}).del()

            let arrImovel = await trx("imoveis").where({id}).del()
        })

        for(let i = 0; i < arrPathsImgsRemover.length; i++){
          let item = arrPathsImgsRemover[i]
          fs.unlink("../" + process.env.NOME_PASTA_RAIZ + "/public/images/" + item.path_imagem, function (err) {
            if (err) throw err;
            console.log('File deleted!');
          });
        }

        res.json(["sucesso", "Imovel deletado com sucesso"])
    }catch(err){
        res.json(["erro", "ocorreu algum erro na remoção do imóvel, por favor tente novamente"])
    }



})

//ROTAS DE DESCRICAO
server.post("/mudarDesc", async (req: Request, res: Response) => {
    type typeBody = {
      idAlterarDesc: string,
      novaDescricao: string
    }

    const {idAlterarDesc, novaDescricao}: typeBody = req.body

    console.log()

    try{
        await db('imoveis').update({descricao: novaDescricao}).where({id: idAlterarDesc})
        res.json(["sucesso"])
    }catch(err){
        res.json(["erro", "ocorreu algum erro ao adicionar a descrição, por favor, tente novamente"])
    }


})



server.get("/status", (req: Request, res:Response) => {
    return res.json({ok: true})
})


server.listen(8800)