package <%=packageName%>.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class <%= entityClass %> {
<% for (fieldId in fields) { %>
    private <%= fields[fieldId].fieldType %> <%= fields[fieldId].fieldName %>;
<% } %>
}
