package <%=packageName%>.functional

import com.jayway.restassured.RestAssured
import com.tek.myservice.Application
import org.junit.Before
import org.junit.runner.RunWith
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.IntegrationTest
import org.springframework.boot.test.SpringApplicationContextLoader
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner
import org.springframework.test.context.web.WebAppConfiguration


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(loader = SpringApplicationContextLoader.class, classes = Application.class)
@WebAppConfiguration
@IntegrationTest("server.port:0")
class AbstractFunctionTest {

    @Value('${local.server.port}')
    int port;

    @Before
    public void setUp() {
        RestAssured.port = this.port;
    }
}
