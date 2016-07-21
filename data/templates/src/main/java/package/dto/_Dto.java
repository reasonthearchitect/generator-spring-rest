package <%=packageName%>.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class <%= entityClass %>Dto {
<% for (fieldId in fields) { %>
    private <%= fields[fieldId].fieldType %> <%= fields[fieldId].fieldName %>;
<% } %>
}
