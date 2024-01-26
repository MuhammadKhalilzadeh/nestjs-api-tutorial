import {Test} from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { authorize } from 'passport';

describe('App e2e', () => {
  let app : INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = 
    await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);
    prisma = app.get(PrismaService);

    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3000");
  });

  afterAll(async () => {
    await app.close();
  });
  
  describe('Auth', () => {
    const dto: AuthDto = {
      email: "email@email.com",
      password: "12341235",
    }
    describe('Signup', () => {
      it("should return an error when email is not valid", async () => {
        return pactum.spec().post("/auth/signup")
        .withBody({
          password: dto.password
        })
        .expectStatus(400)
      });
      
      it("should return an error password empty", async () => {
        return pactum.spec().post("/auth/signup")
        .withBody({
          email: dto.email
        })
        .expectStatus(400)
      });
      
      it("should throw if no body provided", async () => {
        return pactum.spec().post("/auth/signup")
        .expectStatus(400)
      });

      it("should create a new user", async () => {
        return pactum.spec().post("/auth/signup")
        .withBody(dto)
        .expectStatus(201)
      } );
    });

    describe('Signin', () => {
      it("should return an error when email is not valid", async () => {
        return pactum.spec().post("/auth/Signin")
        .withBody({
          password: dto.password
        })
        .expectStatus(400)
      });
      
      it("should return an error password empty", async () => {
        return pactum.spec().post("/auth/Signin")
        .withBody({
          email: dto.email
        })
        .expectStatus(400)
      });
      
      it("should throw if no body provided", async () => {
        return pactum.spec().post("/auth/Signin")
        .expectStatus(400)
      });
      it(
        "should return a token and user data when correct credentials are provided",
        () => {
          return pactum.spec()
          .post("/auth/signin")
        .withBody(dto)
        .expectStatus(200)
        .stores('userAt', 'access_token')
        }
      );
    });
  });
  
  describe('User', () => {
    describe('Get me', () => {
      it("should return an error when not authenticated", async () => {
        return pactum
        .spec()
        .get("/users/me")
        .withHeaders({
          Authorization: 'Bearer $S{userAt}'
        }) 
        .expectStatus(200)
      });
    });

    describe('Edit user', () => {});
  });
  
  describe('Bookmarks', () => {
    describe('Create bookmark', () => {});

    describe('Get bookmark', () => {});

    describe('Get bookmark by id', () => {});

    describe('Edit bookmark by id', () => {});

    describe('Delete bookmark by id', () => {});
  });
});