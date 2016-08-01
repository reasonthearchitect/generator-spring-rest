package <%=packageName%>.stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;

import <%=packageName%>.dto.<%= sinkDtoClass %>;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@EnableBinding(<%= entityClass %>Metadata.class)
public class <%= entityClass %>SinkSocket {

    private static final Logger log = LoggerFactory.getLogger(<%= entityClass %>SinkSocket.class);

    @Autowired
    SimpMessageSendingOperations messagingTemplate;

    @Autowired
    ObjectMapper mapper;


    @StreamListener("<%= sinkName %>")
    public void sink(<%= sinkDtoClass %> <%= sinkDtoInstance %>) {
        sendToClients(<%= sinkDtoInstance %>);
    }

    public void sendToClients(<%= sinkDtoClass %> <%= sinkDtoInstance %>) {
        String json = "";
        try {
            json = this.mapper.writeValueAsString(<%= sinkDtoInstance %>);
        } catch (Exception ex) {ex.printStackTrace();}
        messagingTemplate.convertAndSend("/topic/<%= brokerName %>", json);
    }
}
