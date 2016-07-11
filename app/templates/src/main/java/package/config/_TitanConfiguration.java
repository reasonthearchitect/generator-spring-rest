package <%=packageNameGenerated%>.config;

import com.thinkaurelius.titan.core.TitanFactory;
import com.thinkaurelius.titan.core.TitanGraph;
import org.apache.commons.configuration.BaseConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TitanConfiguration {

    @Bean
    public TitanGraph getTitanGraph() {
        BaseConfiguration conf = new BaseConfiguration();
        conf.setProperty("storage.backend", "com.amazon.titan.diskstorage.dynamodb.DynamoDBStoreManager");
        conf.setProperty("storage.dynamodb.client.endpoint", "http://localhost:4567");
        conf.setProperty("index.search.backend", "elasticsearch");
        conf.setProperty("index.search.directory", "/tmp/searchindex");
        conf.setProperty("index.search.elasticsearch.client-only", "false");
        conf.setProperty("index.search.elasticsearch.local-mode", "true");
        conf.setProperty("index.search.elasticsearch.interface", "NODE");
        return TitanFactory.open(conf);
    }
}